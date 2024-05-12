// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;

#[tauri::command]
fn save_game(save_path: String, game_file: String) {
    fs::write(save_path, game_file).expect("Unable to write file");
}

#[tauri::command]
fn load_game(load_path: String) -> String {
    let game_data: String = fs::read_to_string(load_path).expect("Unable to read file");
    return game_data.into();
}

#[tauri::command]
fn download_export(download_path: String, export_file: String) {
    fs::write(download_path, export_file).expect("Unable to export game");
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save_game, load_game, download_export])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
