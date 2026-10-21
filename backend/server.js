const express = require('express');
const sharp = require('sharp');
const app = express();
const PORT = 3000;

// Настройка приема бинарных данных (картинки) в теле запроса
app.use(express.raw({ type: 'image/jpeg', limit: '10mb' }));

// Эндпоинт для сжатия JPG
app.post('/compress', async (req, res) => {
    try {
        if (!req.body || req.body.length === 0) {
            return res.status(400).send('Ошибка: Вы не отправили файл.');
        }

        // Оптимизация JPG с помощью sharp
        const optimizedBuffer = await sharp(req.body)
            .jpeg({ 
                quality: 80,       // Качество (от 1 до 100). 75-80 — оптимальный баланс
                progressive: true, // Прогрессивный режим (быстрее грузится в вебе)
                mozjpeg: true      // Включает продвинутое сжатие от Mozilla
            })
            .toBuffer();

        // Отправка сжатого изображения обратно клиенту
        res.set('Content-Type', 'image/jpeg');
        res.send(optimizedBuffer);

    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при обработке изображения.');
    }
});

app.listen(PORT, () => console.log(`API запущен на http://localhost:${PORT}`));

