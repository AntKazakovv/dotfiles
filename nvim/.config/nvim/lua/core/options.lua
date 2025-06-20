-- Общие опции
local o = vim.opt
vim.o.background = "dark" -- or "light" for light mode
vim.cmd([[colorscheme gruvbox]])

o.number       = true         -- номера строк
o.relativenumber = true       -- относительные номера
o.expandtab    = true         -- использовать пробелы вместо табов
o.shiftwidth   = 4            -- ширина отступа
o.tabstop      = 4            -- ширина таба
o.termguicolors = true        -- true color
o.signcolumn   = "yes"        -- всегда показывать колонку для знаков
o.clipboard    = "unnamedplus"-- общий буфер обмена
o.cursorline = true

