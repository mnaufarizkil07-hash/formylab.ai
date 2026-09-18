import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function parseCSV(filePath: string) {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`File tidak ditemukan di path: ${filePath}`);
      return [];
    }
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const lines = fileContent.trim().split("\n");
    if (lines.length < 2) return [];
    
    // Ambil header dari baris pertama
    const headers = lines[0].trim().split(",").map(h => h.replace(/"/g, "").trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].trim();
      if (!row) continue;
      
      const values = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      let obj: any = {};
      
      headers.forEach((h, idx) => {
        let val = values[idx] || "";
        if (val.startsWith('"') && val.endsWith('"')) val = val.substring(1, val.length - 1);
        obj[h] = val.trim();
      });
      data.push(obj);
    }
    return data;
  } catch (error) {
    console.error(`[API ERROR] Gagal membaca file:`, error);
    return [];
  }
}

export async function GET() {
  try {
    // Cari file supplier.csv di root project atau folder data
    let filePath = path.join(process.cwd(), "supplier.csv");
    if (!fs.existsSync(filePath)) {
      filePath = path.join(process.cwd(), "data", "supplier.csv");
    }
    if (!fs.existsSync(filePath)) {
      // Coba nama file asli user jika belum di-rename
      filePath = path.join(process.cwd(), "raw_material_supplier_dataset_EN.xlsx - supplier_raw_materials (1).csv");
    }

    const rawSuppliers = parseCSV(filePath);

    if (rawSuppliers.length === 0) {
      return NextResponse.json({ success: true, count: 0, items: [] });
    }

    const libraryItems = rawSuppliers.map((s: any) => ({
      id: s.Ingredient_id || s.row_id || "ID",
      name: s.ingredient_name || s.nama_bahan || "Unknown Ingredient",
      grade: s.grade || "Standard",
      supplier: s.supplier || s.supplier_name || "General Distributor",
      price: s.price_per_g ? `Rp ${parseFloat(s.price_per_g).toLocaleString("id-ID")} /g` : "N/A",
      isHalal: String(s.supplier_halal_certificate || "").toLowerCase() === "yes" || String(s.supplier_halal_certificate || "").toLowerCase().includes("halal")
    }));

    return NextResponse.json({ success: true, count: libraryItems.length, items: libraryItems });
  } catch (error) {
    console.error("Library API Error:", error);
    return NextResponse.json({ success: false, error: "Gagal memuat library bahan" }, { status: 500 });
  }
}