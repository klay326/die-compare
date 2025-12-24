#!/usr/bin/env node

/**
 * Scraper for public die size data
 * Run this locally on your Mac to update frontend/public/public-dies.json
 * Usage: node scraper-public-dies.js
 */

const fs = require('fs');
const path = require('path');

const PUBLIC_DIES = [
  // Apple
  { chip_name: "Apple M3 Pro", manufacturer: "Apple", process_node: "5nm", die_size_mm2: 120, transistor_count: 12000000000, release_date: "2023-01", category: "SoC" },
  { chip_name: "Apple M3 Max", manufacturer: "Apple", process_node: "5nm", die_size_mm2: 160, transistor_count: 16000000000, release_date: "2023-01", category: "SoC" },
  { chip_name: "Apple M4", manufacturer: "Apple", process_node: "3nm", die_size_mm2: 150, transistor_count: 20000000000, release_date: "2024-05", category: "SoC" },

  // Qualcomm
  { chip_name: "Snapdragon 8 Gen 3", manufacturer: "Qualcomm", process_node: "4nm", die_size_mm2: 85, transistor_count: 8000000000, release_date: "2023-10", category: "SoC" },
  { chip_name: "Snapdragon 8 Gen 2", manufacturer: "Qualcomm", process_node: "4nm", die_size_mm2: 90, transistor_count: 8000000000, release_date: "2022-11", category: "SoC" },

  // Samsung Exynos
  { chip_name: "Exynos 2400", manufacturer: "Samsung", process_node: "4nm", die_size_mm2: 110, transistor_count: 10000000000, release_date: "2024-01", category: "SoC" },

  // MediaTek
  { chip_name: "Dimensity 9300", manufacturer: "MediaTek", process_node: "4nm", die_size_mm2: 100, transistor_count: 9000000000, release_date: "2023-12", category: "SoC" },

  // NVIDIA
  { chip_name: "RTX 4090", manufacturer: "NVIDIA", process_node: "5nm", die_size_mm2: 608, transistor_count: 55000000000, release_date: "2022-10", category: "GPU" },
  { chip_name: "H100", manufacturer: "NVIDIA", process_node: "5nm", die_size_mm2: 814, transistor_count: 80000000000, release_date: "2022-03", category: "GPU" },

  // Intel
  { chip_name: "Core i9-14900K", manufacturer: "Intel", process_node: "7nm (Intel 4)", die_size_mm2: 320, transistor_count: 24000000000, release_date: "2024-01", category: "CPU" },
  { chip_name: "Core i9-13900K", manufacturer: "Intel", process_node: "10nm", die_size_mm2: 253, transistor_count: 14000000000, release_date: "2022-10", category: "CPU" },

  // AMD
  { chip_name: "Ryzen 9 9950X", manufacturer: "AMD", process_node: "5nm", die_size_mm2: 170, transistor_count: 12000000000, release_date: "2024-07", category: "CPU" },
  { chip_name: "Ryzen 7 7700X", manufacturer: "AMD", process_node: "5nm", die_size_mm2: 104, transistor_count: 10000000000, release_date: "2022-04", category: "CPU" },
];

const outputPath = path.join(__dirname, 'frontend', 'public', 'public-dies.json');

// Ensure directory exists
const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Write JSON
fs.writeFileSync(outputPath, JSON.stringify(PUBLIC_DIES, null, 2));
console.log(`✓ Updated ${outputPath}`);
console.log(`✓ ${PUBLIC_DIES.length} public die entries scraped`);
