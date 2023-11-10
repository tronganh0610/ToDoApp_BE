const express = require('express');
const app = express();
const port = 3000; // Thay đổi cổng theo nhu cầu của bạn

const sql = require('mssql');

// Thiết lập kết nối với SQL Server
const config = {
  user: 'sa',
  password: "12",
  server: 'MSI\\MAYCHU',
  database: 'testflutter',
  options: {
    encrypt: true,
    trustServerCertificate: true, // Bật chế độ không kiểm tra chứng chỉ (không an toàn)
  },
};

app.get('/api/data', (req, res) => {
  sql.connect(config, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    const request = new sql.Request();
    request.query('SELECT * FROM TodoApp', (err, result) => {
      if (err) {
        console.error(err);
        return;
      }

      res.json(result.recordset);
      sql.close();
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
app.post('/api/update-data', (req, res) => {
    const updatedData = req.body; // Lấy dữ liệu cập nhật từ yêu cầu POST
  
    // Thực hiện cập nhật dữ liệu trong cơ sở dữ liệu dựa trên trường STT
    sql.connect(config, (err) => {
      if (err) {
        console.error(err);
        return;
      }
  
      const request = new sql.Request();
      request.input('Stt', sql.NChar, updatedData.Stt); 
      request.input('TenCV', sql.NVarChar, updatedData.TenCV);
      request.input('date', sql.DateTime, new Date(updatedData.date));
      request.input('check', sql.Bit, updatedData.check);
  
      request.query(
        'UPDATE TodoApp SET TenCV = @TenCV, date = @date, check = @check WHERE Stt = @Stt',
        (err, result) => {
          if (err) {
            console.error(err);
            return;
          }
  
          // Trả về phản hồi
          res.json({ message: 'Dữ liệu đã được cập nhật thành công' });
          sql.close();
        }
      );
    });
  });
  