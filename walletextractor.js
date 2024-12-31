import fs from 'fs';  
import chalk from 'chalk';  

function logInfo(message) {  
    console.log(chalk.cyan(`[INFO] ${message}`));  
}  

function logSuccess(message) {  
    console.log(chalk.green(`[SUCCESS] ${message}`));  
}  

function logError(message) {  
    console.log(chalk.red(`[ERROR] ${message}`));  
}  

// Declare accounts variable in the outer scope  
let accounts;  

try {  
    logInfo("Membaca file 'wallets.json'...");  
    const data = fs.readFileSync('wallets.json', 'utf8');  
    accounts = JSON.parse(data); // Assign to the outer variable  
    logSuccess("File 'wallets.json' berhasil dibaca!");  
} catch (err) {  
    if (err.code === 'ENOENT') {  
        logError("File 'wallets.json' tidak ditemukan. Pastikan file tersebut ada di direktori yang sama.");  
        process.exit();  
    } else if (err instanceof SyntaxError) {  
        logError("Format file 'wallets.json' tidak valid. Pastikan file berisi format yang benar.");  
        process.exit();  
    } else {  
        logError(`Terjadi kesalahan: ${err.message}`);  
        process.exit();  
    }  
}  

try {  
    logInfo("Membuka file output untuk penulisan data...");  
    const addressFile = fs.createWriteStream('!address.txt');  
    const privateKeyFile = fs.createWriteStream('!wallets.txt');  
    const mnemonicFile = fs.createWriteStream('!mnemonic.txt');  

    accounts.forEach((account, index) => {  
        logInfo(`Memproses akun ke-${index + 1}...`);  

        const address = account.address || '';  
        const privateKey = account.privateKey || '';  
        const mnemonic = account.mnemonic || '';  

        addressFile.write(address + '\n');  
        privateKeyFile.write(privateKey + '\n');  
        mnemonicFile.write(mnemonic + '\n');  

        logSuccess(`Akun ke-${index + 1} berhasil diekstrak!`);  
    });  

    addressFile.end();  
    privateKeyFile.end();  
    mnemonicFile.end();  

    logSuccess("Semua data berhasil diekstrak dan disimpan ke file!");  
    logInfo("File yang dihasilkan: '!address.txt', '!wallets.txt', dan '!mnemonic.txt'");  
} catch (err) {  
    logError(`Terjadi kesalahan saat menulis file: ${err.message}`);  
    process.exit();  
}