#!/usr/bin/env node
/* eslint-disable */

// Скрипт для конвертации данных из Excel в JSON
// Заменяет Python-скрипт process_exercises.py
import XLSX from 'xlsx'
import fs from 'fs'
import path from 'path'

// Функция для поиска Excel-файла
function findExcelFile() {
  const possiblePaths = [
    './exercises.xlsx',
    './src/sources/exercises.xlsx',
    '../sources/exercises.xlsx',
    '../../sources/exercises.xlsx',
    '../../../src/sources/exercises.xlsx',
    '../src/sources/exercises.xlsx'
  ]

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      console.log(`Найден файл по пути: ${filePath}`)
      return filePath
    }
  }

  console.error('Файл exercises.xlsx не найден!')
  console.error('Пожалуйста, поместите файл exercises.xlsx в одну из следующих директорий:')
  possiblePaths.forEach(p => console.error(`- ${p}`))
  process.exit(1)
}

// Функция конвертации
function convertExcelToJson() {
  try {
    // Находим Excel-файл
    const xlsxPath = findExcelFile()

    // Читаем данные из Excel-файла
    const workbook = XLSX.readFile(xlsxPath)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]

    // Преобразуем в массив объектов
    const data = XLSX.utils.sheet_to_json(worksheet)

    console.log(`Загружено ${data.length} строк из Excel`)

    // Инициализируем структуру для exercises.json
    const exercisesData = {
      study_exercises: [], // type_id = 1
      check_exercises: [], // type_id = 2
      repetition_exercises: [], // type_id = 3
    }

    // Обрабатываем каждую строку
    data.forEach(row => {
      if (!row.topic_id || !row.type_id || !row.id) return

      // Создаем базовую структуру задания
      const exercise = {
        topic_id: Number(row.topic_id),
        id: Number(row.id),
        task: String(row.task || ''),
        answer: String(row.answer || ''),
      }

      // Добавляем подсказку, если она есть
      if ('hint' in row && row.hint) {
        exercise.hint = String(row.hint)
      }

      // Распределяем задания по типам
      const typeId = Number(row.type_id)
      if (typeId === 1) {
        exercisesData.study_exercises.push(exercise)
      } else if (typeId === 2) {
        exercisesData.check_exercises.push(exercise)
      } else if (typeId === 3) {
        exercisesData.repetition_exercises.push(exercise)
      }
    })

    // Сортируем задания по topic_id и id
    for (const key in exercisesData) {
      exercisesData[key].sort((a, b) => {
        if (a.topic_id !== b.topic_id) {
          return a.topic_id - b.topic_id
        }
        return a.id - b.id
      })
    }

    // Сохраняем результат в JSON
    // Независимо от местоположения входного файла, выходной файл
    // всегда будет в директории src/data/exercises.json
    const outputPath = './data/exercises.json'

    fs.writeFileSync(outputPath, JSON.stringify(exercisesData, null, 2), 'utf8')

    console.log(`Файл exercises.json успешно создан: ${outputPath}`)
    console.log(`Статистика:`)
    console.log(`- Обучающие задания: ${exercisesData.study_exercises.length}`)
    console.log(`- Проверочные задания: ${exercisesData.check_exercises.length}`)
    console.log(`- Задания на повторение: ${exercisesData.repetition_exercises.length}`)
  } catch (error) {
    console.error(`Ошибка при обработке данных: ${error.message}`)
    process.exit(1)
  }
}

// Запускаем конвертацию
convertExcelToJson()
