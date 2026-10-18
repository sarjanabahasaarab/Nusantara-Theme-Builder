// Nusantara Theme Builder — Tauri 2 Desktop Library
// Menangani perintah IPC asli desktop, dialog penyimpanan lokal, dan operasi berkas.

#[tauri::command]
fn get_desktop_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_desktop_version])
        .run(tauri::generate_context!())
        .expect("Gagal menjalankan aplikasi desktop Nusantara Theme Builder");
}
