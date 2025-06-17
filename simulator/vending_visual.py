import tkinter as tk
from tkinter import messagebox
from tkinter import ttk
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
MASTERS_URL = "http://localhost:3000/api/masters"
TENANTS_URL = "http://localhost:3000/api/tenants"
BACKUP_FILE = "ventas_backup.json"

class VendingSim:
    def __init__(self, root):
        self.root = root
        self.root.title("🧪 Máquina de Vending Simulada (Con backup y envío)")

        self.saldo_cashless = 0.0
        self.saldo_efectivo = 0.0
        self.ventas = []
        self.masters = []
        self.selected_master = None
        self.tenants = []
        self.selected_tenant = None

        self.build_gui()
        self.cargar_backup()
        self.cargar_tenants()

    def build_gui(self):
        frame_tenant = tk.LabelFrame(self.root, text="Selecciona tenant")
        frame_tenant.grid(row=0, column=0, padx=10, pady=10, sticky="n")

        self.tenant_search_var = tk.StringVar()
        tenant_search_entry = tk.Entry(frame_tenant, textvariable=self.tenant_search_var)
        tenant_search_entry.pack(fill="x")
        self.tenant_list = tk.Listbox(frame_tenant, height=5)
        self.tenant_list.pack(fill="both", expand=True)
        self.tenant_list.bind("<<ListboxSelect>>", self.on_select_tenant)
        self.tenant_search_var.trace_add("write", lambda *args: self.update_tenant_list())
        frame_master = tk.LabelFrame(self.root, text="Selecciona master")
        frame_master.grid(row=1, column=0, padx=10, pady=10, sticky="n")

        self.search_var = tk.StringVar()
        search_entry = tk.Entry(frame_master, textvariable=self.search_var)
        search_entry.pack(fill="x")
        self.master_list = tk.Listbox(frame_master, height=5)
        self.master_list.pack(fill="both", expand=True)
        self.master_list.bind("<<ListboxSelect>>", self.on_select_master)
        self.search_var.trace_add("write", lambda *args: self.update_master_list())
        
        frame_prod = tk.LabelFrame(self.root, text="Selecciona un producto")
        frame_prod.grid(row=1, column=0, padx=10, pady=10)

        for idx, (code, item) in enumerate(PRODUCTOS.items()):
            b = tk.Button(frame_prod, text=f"{code} - {item['nombre']}\n{item['precio']} €",
                          width=18, height=3,
                          command=lambda c=code: self.comprar_producto(c))
            b.grid(row=idx // 2, column=idx % 2, padx=5, pady=5)

        frame_saldo = tk.LabelFrame(self.root, text="Saldo disponible")
        frame_saldo.grid(row=3, column=0, padx=10, pady=5, sticky='w')

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
        frame_ventas.grid(row=0, column=1, rowspan=4, padx=10, pady=10)

        self.txt_ventas = tk.Text(frame_ventas, width=40, height=20, state='disabled')
        self.txt_ventas.pack()

    def actualizar_saldo(self):
        self.lbl_cash.config(text=f"Cashless: {self.saldo_cashless:.2f} €")
        self.lbl_eff.config(text=f"Efectivo: {self.saldo_efectivo:.2f} €")

    def cargar_masters(self):
        headers = {"x-api-key": "supersecreta123"}
        try:
            url = MASTERS_URL
            if self.selected_tenant:
                url += f"?tenantId={self.selected_tenant['id']}"
            resp = requests.get(url, headers=headers)
            if resp.status_code == 200:
                self.masters = resp.json()
            else:
                self.masters = []
        except Exception as e:
            print(f"Error fetching masters: {e}")
            self.masters = []
        self.update_master_list()

    def cargar_tenants(self):
        headers = {"x-api-key": "supersecreta123"}
        try:
            resp = requests.get(TENANTS_URL, headers=headers)
            if resp.status_code == 200:
                self.tenants = resp.json()
            else:
                self.tenants = []
        except Exception as e:
            print(f"Error fetching tenants: {e}")
            self.tenants = []
        self.update_tenant_list()

    def update_tenant_list(self):
        query = self.tenant_search_var.get().lower() if hasattr(self, "tenant_search_var") else ""
        self.tenant_list.delete(0, tk.END)
        for t in self.tenants:
            if query in t["name"].lower():
                self.tenant_list.insert(tk.END, t["name"])

    def on_select_tenant(self, _event=None):
        selection = self.tenant_list.curselection()
        if not selection:
            return
        name = self.tenant_list.get(selection[0])
        self.selected_tenant = next((t for t in self.tenants if t["name"] == name), None)
        if self.selected_tenant:
            self.registrar_evento(f"🏢 Tenant seleccionado: {name}")
            self.cargar_masters()


    def update_master_list(self):
        query = self.search_var.get().lower() if hasattr(self, "search_var") else ""
        self.master_list.delete(0, tk.END)
        for m in self.masters:
            if query in m["serialNumber"].lower():
                self.master_list.insert(tk.END, m["serialNumber"])

    def on_select_master(self, _event=None):
        selection = self.master_list.curselection()
        if not selection:
            return
        serial = self.master_list.get(selection[0])
        self.selected_master = next((m for m in self.masters if m["serialNumber"] == serial), None)
        if self.selected_master:
            self.registrar_evento(f"🔗 Master seleccionado: {serial}")
            
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
        if not self.selected_tenant:
            messagebox.showwarning("Tenant", "Selecciona un tenant primero")
            return
        if not self.selected_master:
            messagebox.showwarning("Master", "Selecciona un master primero")
            return

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
        else:
            venta["importe_introducido"] = precio
            venta["cambio"] = 0.0
            
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
        if not self.selected_master or not self.selected_master.get("pos"):
            self.registrar_evento("⚠️ Master sin POS asociado")
            return

        payload = {
            "posCode": self.selected_master["pos"]["code"],
            "line": venta["codigo"],
            "method": "CARD" if venta["metodo"] == "cashless" else "COIN",
            "price": venta["precio"],
            "inserted": venta["importe_introducido"],
            "change": venta["cambio"],
            "timestamp": venta["timestamp"],
        }

        try:
            headers = {"x-api-key": "supersecreta123"}
            response = requests.post(SERVER_URL, json=payload, timeout=5, headers=headers)
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
