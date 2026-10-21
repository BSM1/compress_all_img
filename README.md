# Parallel JPG Image Compressor (CLI + API)

A production-ready solution for **bulk parallel compression of JPG/JPEG images** in your current terminal directory. 

The system consists of two parts:
1. A **Bash script** (Cygwin CLI) that processes files in parallel (up to 4 streams) using `xargs` and `curl`.
2. A lightweight **Node.js API server** powered by `Express` and `Sharp` that applies advanced compression algorithms (`mozjpeg`).

## Features

- **High Performance:** Processes up to 4 images simultaneously.
- **Advanced Compression:** Uses `Sharp` with `mozjpeg: true` and `progressive: true` at 80% quality for optimal file-size-to-quality ratio.
- **Smart Sorting:** Sorts files naturally (`1, 2, 10, 11...`) via `sort -V` to guarantee sequence order.
- **Automated Lifecycle:** The Bash script spins up the Node.js server dynamically at launch and safely terminates it (`kill`) when execution finishes.
- **Structured Naming & Logs:** Output files include custom IDs, clear timestamps, and indexes. Generates detailed session logs.

## Requirements

- **Cygwin** (with `bash`, `curl`, and `xargs` packages installed)
- **Node.js** `v22.14.0` or higher

## Project Structure & Installation

By default, the API server must be placed in `C:\jpg-compress` (Cygwin path: `/cygdrive/c/jpg-compress`).

### 1. Setup the Backend API
Navigate to your server directory, fix your `.nvmrc` file, and install dependencies:
```bash
cd /cygdrive/c/jpg-compress
echo "22" > .nvmrc
npm install
```

### 2. Setup the CLI Script
Move your Bash script to the local system path so you can call it from any folder:
```bash
cp compress_all_img /usr/local/bin/
chmod +x /usr/local/bin/compress_all_img
```
*Note: If you want to change the server path, edit line 25 in `/usr/local/bin/compress_all_img`.*

## Usage

Navigate to any directory with your source `.jpg`/`.jpeg` images and run the script with a mandatory alphanumeric session prefix (letters, numbers, hyphens, and underscores allowed):

```bash
compress_all_img Project0
```

### Directory Output Workflow

The script automatically creates an output directory structure:
```text
current_directory/
├── photo_01.jpg
├── photo_02.jpg
├── Project0_compress_log.txt        # Full session terminal dump
└── compress jpg/                      # Generated folder for results
    ├── compression_log.txt            # Step-by-step processing database log
    ├── compress__Project0--2026-10-21--13-10--01.00.jpg
    └── compress__Project0--2026-10-21--13-10--02.00.jpg
```

## Behind the Scenes (API Configuration)

The backend listens on **Port 3000** and has a **10MB payload limit** per image.
- **Endpoint:** `POST http://localhost:3000/compress`
- **Headers:** `Content-Type: image/jpeg`
- **Engine settings:** 
  - `quality: 80`
  - `progressive: true`
  - `mozjpeg: true`
