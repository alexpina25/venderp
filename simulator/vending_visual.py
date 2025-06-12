import tkinter as tk
from tkinter import messagebox
import json
from datetime import datetime
import requests
import os

PRODUCTOS = {
    "A1": {"nombre": "Agua", "precio": 1.00},
    "A2": {"nombre": "Coca-Cola", "precio": 1.50},
    "B1": {"nombre": "Snack", "precio": 2.00},
    "B2": {"nombre": "Zumo", "precio": 1.20},
    "C1": {"nombre": "Barrita", "precio": 0.80},
    "C2": {"nombre": "Café", "precio": 1.00},
}

SERVER_URL = "http://localhost:3000/api/sales"
BACKUP_FILE = "ventas_backup.json"

class VendingSim:
    def __init__(self, root):
        self.root = root
        self.root.title("🧪 Máquina de Vending Simulada (Con backup y envío)")

        self.saldo_cashless = 0.0
        self.saldo_efectivo = 0.0
        self.ventas = []

        self.build_gui()
        self.cargar_backup()

    def build_gui(self):
        frame_prod = tk.LabelFrame(self.root, text="Selecciona un producto")
        frame_prod.grid(row=0, column=0, padx=10, pady=10)

        for idx, (code, item) in enumerate(PRODUCTOS.items()):
            b = tk.Button(frame_prod, text=f"{code} - {item['nombre']}\n{item['precio']} €",
                          width=18, height=3,
                          command=lambda c=code: self.comprar_producto(c))
            b.grid(row=idx // 2, column=idx % 2, padx=5, pady=5)

        frame_saldo = tk.LabelFrame(self.root, text="Saldo disponible")
        frame_saldo.grid(row=1, column=0, padx=10, pady=5, sticky='w')

        self.lbl_cash = tk.Label(frame_saldo, text="Cashless: 0.00 €")
        self.lbl_cash.pack(anchor='w')
        self.lbl_eff = tk.Label(frame_saldo, text="Efectivo: 0.00 €")
        self.lbl_eff.pack(anchor='w')

        btn_cash = tk.Button(frame_saldo, text="➕ Añadir 2 € Cashless", command=self.añadir_cashless)
        btn_cash.pack(pady=2)
        btn_eff = tk.Button(frame_saldo, text="➕ Añadir 1 € Efectivo", command=self.añadir_efectivo)
        btn_eff.pack(pady=2)
        btn_devo = tk.Button(frame_saldo, text="💸 Devolver saldo", command=self.devolver_saldo)
        btn_devo.pack(pady=5)

        frame_ventas = tk.LabelFrame(self.root, text="🧾 Ventas registradas")
        frame_ventas.grid(row=0, column=1, rowspan=2, padx=10, pady=10)

        self.txt_ventas = tk.Text(frame_ventas, width=40, height=20, state='disabled')
        self.txt_ventas.pack()

    def actualizar_saldo(self):
        self.lbl_cash.config(text=f"Cashless: {self.saldo_cashless:.2f} €")
        self.lbl_eff.config(text=f"Efectivo: {self.saldo_efectivo:.2f} €")

    def añadir_cashless(self):
        self.saldo_cashless += 2.00
        self.actualizar_saldo()

    def añadir_efectivo(self):
        self.saldo_efectivo += 1.00
        self.actualizar_saldo()

    def devolver_saldo(self):
        total_devuelto = self.saldo_cashless + self.saldo_efectivo
        if total_devuelto == 0:
            messagebox.showinfo("Devolución", "No hay saldo para devolver.")
            return

        self.saldo_cashless = 0.0
        self.saldo_efectivo = 0.0
        self.actualizar_saldo()
        self.registrar_evento(f"💸 Devolución total: {total_devuelto:.2f} €")

    def comprar_producto(self, codigo):
        prod = PRODUCTOS[codigo]
        precio = prod["precio"]

        if self.saldo_cashless >= precio:
            self.saldo_cashless -= precio
            metodo = "cashless"
            self.actualizar_saldo()
            self.registrar_venta(codigo, precio, metodo)
        elif self.saldo_efectivo >= precio:
            importe_introducido = self.saldo_efectivo
            cambio = round(importe_introducido - precio, 2)
            self.saldo_efectivo -= precio
            self.actualizar_saldo()
            self.registrar_venta(codigo, precio, "efectivo", importe_introducido, cambio)
        else:
            messagebox.showwarning("Saldo insuficiente", "No tienes saldo suficiente para comprar.")

    def registrar_venta(self, codigo, precio, metodo, importe_introducido=None, cambio=None):
        venta = {
            "codigo": codigo,
            "producto": PRODUCTOS[codigo]["nombre"],
            "precio": precio,
            "metodo": metodo,
            "timestamp": datetime.now().isoformat()
        }

        if metodo == "efectivo":
            venta["importe_introducido"] = importe_introducido
            venta["cambio"] = cambio

        self.ventas.append(venta)
        self.registrar_evento(
            f"✅ Venta: {venta['producto']} - {venta['precio']:.2f} € ({metodo})" +
            (f" | Introducido: {importe_introducido:.2f} €, Cambio: {cambio:.2f} €" if metodo == "efectivo" else "")
        )
        self.guardar_backup()
        self.enviar_venta_json(venta)

    def registrar_evento(self, mensaje):
        self.txt_ventas.configure(state='normal')
        self.txt_ventas.insert('end', mensaje + '\n')
        self.txt_ventas.configure(state='disabled')
        self.txt_ventas.see('end')

    def enviar_venta_json(self, venta):
        payload = {
            "device_id": "caslab_sim_01",
            "timestamp": datetime.now().isoformat(),
            "venta": venta
        }

        try:
            response = requests.post(SERVER_URL, json=payload, timeout=5)
            if response.status_code == 200:
                self.registrar_evento("📡 JSON enviado con éxito al servidor.")
            else:
                self.registrar_evento(f"⚠️ Error al enviar: código {response.status_code}")
        except Exception as e:
            self.registrar_evento(f"❌ Fallo de red: {e}")

    def guardar_backup(self):
        try:
            with open(BACKUP_FILE, 'w', encoding='utf-8') as f:
                json.dump(self.ventas, f, indent=2, ensure_ascii=False)
        except Exception as e:
            self.registrar_evento(f"❌ Error guardando backup: {e}")

    def cargar_backup(self):
        if os.path.exists(BACKUP_FILE):
            try:
                with open(BACKUP_FILE, 'r', encoding='utf-8') as f:
                    self.ventas = json.load(f)
                    for venta in self.ventas:
                        resumen = f"🕘 {venta['producto']} - {venta['precio']} € ({venta['metodo']})"
                        self.registrar_evento(resumen)
            except:
                self.ventas = []

if __name__ == "__main__":
    root = tk.Tk()
    app = VendingSim(root)
    root.mainloop()
