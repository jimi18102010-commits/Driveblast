# 📘 Руководство пользователя DriveBlast (на русском языке)

**DriveBlast** — это скоростной консольный загрузчик файлов с Google Диска с поддержкой докачки, обхода окон предупреждений о вирусах и экспорта Google Документов / Таблиц.

---

## ⚡ Быстрый старт

### 1. Установка в систему

```bash
git clone https://github.com/jimi18102010-commits/driveblast.git
cd driveblast
python3 -m venv .venv
source .venv/bin/activate        # Для Bash/Zsh
# ИЛИ для Fish shell в CachyOS:
# source .venv/bin/activate.fish

pip install -e .
```

---

## 🎮 Примеры использования

### Интерактивный запуск (без параметров)
Просто введите:
```bash
driveblast
```
Программа красиво запросит ссылку или ID файла в терминале!

### Скачивание по ссылке
```bash
driveblast "https://drive.google.com/file/d/ВАШ_FILE_ID/view?usp=sharing"
```

### Скачивание с указанием имени файла
```bash
driveblast ВАШ_FILE_ID -o dataset.zip
```

### Экспорт Google Документов (Docs) в нужный формат
```bash
# Скачать Google Документ в PDF
driveblast "https://docs.google.com/document/d/DOC_ID/edit" --format pdf

# Скачать Google Документ в Word (DOCX)
driveblast "https://docs.google.com/document/d/DOC_ID/edit" --format docx
```

### Экспорт Google Таблиц (Sheets) в Excel / CSV
```bash
driveblast "https://docs.google.com/spreadsheets/d/SHEET_ID/edit" --format xlsx
driveblast "https://docs.google.com/spreadsheets/d/SHEET_ID/edit" --format csv
```

---

## ⏸ Пауза и докачка (Resume)

Если во время скачивания файла на 10 ГБ пропал интернет или вы нажали `Ctrl+C`:
```text
⚠ Download paused at 450.20 MB. Run the command again to resume.
```
Просто запустите ту же команду снова — DriveBlast определит частичный файл и продолжит загрузку ровно с того места, где она прервалась!

---

## ❓ Часто задаваемые вопросы (FAQ)

### Ошибка: `Access Denied (401/403): The document or file is private`
* **Причина:** Файл закрыт настройками приватности на Google Диске.
* **Решение:** Откройте файл в браузере -> Нажмите **«Поделиться»** -> Переключите доступ на **«Все, у кого есть ссылка» (Anyone with the link)**.

### Ошибка в Fish Shell при `source .venv/bin/activate`
* **Решение:** В CachyOS/Fish используйте `source .venv/bin/activate.fish`.
