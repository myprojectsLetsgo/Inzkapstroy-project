const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('🔄 Проверка подключения к базе данных...');
  
  // Попробуем разные варианты хоста
  const hosts = [
    'localhost',
    'nnmiraoy_inzhkap.mysql.beget.com',
    'mysql.beget.com',
    '127.0.0.1'
  ];
  
  for (const host of hosts) {
    try {
      console.log(`\n📡 Пробуем хост: ${host}`);
      const connection = await mysql.createConnection({
        host: host,
        user: 'nnmiraoy_inzhkap',
        password: '%J6SGWaS664E',
        database: 'nnmiraoy_inzhkap',
        connectTimeout: 5000
      });
      
      console.log(`✅ ПОДКЛЮЧЕНИЕ УСПЕШНО! Хост: ${host}`);
      await connection.end();
      return;
    } catch (err) {
      console.log(`❌ Ошибка: ${err.message}`);
    }
  }
  
  console.log('\n⚠️ Не удалось подключиться ни к одному хосту');
}

testConnection();