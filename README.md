# BYTEEX Landing Page

Повна реалізація landing page для бренду BYTEEX на основі макету з Figma.

## Структура проєкту

```
BYTEEX/
├── index.html          # Головна HTML сторінка
├── css/
│   └── styles.css      # Стилі для сторінки
├── images/             # Зображення з Figma
│   ├── logo.svg        # Логотип BYTEEX
│   ├── hero-new-1.png  # Ліве hero зображення
│   ├── hero-new-2-656c2d.png # Центральне hero зображення
│   ├── hero-new-3.png  # Праве hero зображення
│   └── amy-avatar.png  # Аватар для відгуку
└── README.md           # Документація
```

## Особливості макету

### Top Banner
- Світло-бежевий фон (#F9F0E5)
- Три інформаційні блоки розділені вертикальними лініями
- Uppercase текст з правильним letter-spacing

### Hero Section

**Ліва частина:**
- Логотип BYTEEX
- Великий заголовок "Don't apologize for being comfortable."
- Три feature points з іконками:
  - Beautiful, comfortable loungewear for day or night
  - No wasteful extras, like tags or plastic packaging
  - Our signature fabric is incredibly comfortable
- CTA кнопка "Customize Your Outfit"
- Відгук клієнта (Amy P.) з рейтингом та текстом

**Права частина:**
- Градієнтний фон (від #F9F0E5 до прозорого)
- Три lifestyle зображення з накладанням:
  - Ліве: 134x189px, зсув вниз на 119px
  - Центральне: 209x316.63px, зсув вниз на 54px (найбільше)
  - Праве: 134x189px, зсув вниз на 119px
- Загальний розмір контейнера: 725x422.48px

## Кольори

- **Основний текст**: `#01005B` (темно-синій)
- **Фон банеру**: `#F9F0E5` (світло-бежевий)
- **Білий фон**: `#FFFFFF`
- **Зірки рейтингу**: `#FFD700` (золотий)
- **Градієнт hero-right**: `linear-gradient(180deg, rgba(249, 240, 229, 1) 0%, rgba(249, 240, 229, 0.31) 100%)`

## Шрифти

Використовується шрифт **Inter** з Google Fonts з fallback на системні шрифти.

## Розміри та відступи

- Максимальна ширина контейнера: 1464px
- Padding секцій: 60-80px вертикально, 133px горизонтально
- Gap між колонками: 80px
- Border radius: 8px для карток та кнопок, 5px для кнопки CTA

## Responsive Design

Макет адаптивний для різних розмірів екранів:
- Desktop: повна версія з двома колонками
- Tablet (1200px): одна колонка, зменшені відступи
- Mobile (768px): вертикальне розташування, зменшені шрифти
- Small mobile (480px): повна ширина кнопок, оптимізовані розміри

## Відкриття проєкту

Просто відкрийте `index.html` у браузері для перегляду сторінки.

## Технології

- HTML5
- CSS3 (Flexbox, Grid)
- SVG для іконок
- Google Fonts (Inter)

