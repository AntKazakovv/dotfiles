vim.loader.enable()
require('core.lazy')    -- загрузка менеджера плагинов и плагинов
require('core.options') -- базовые опции
require('core.keymaps') -- базовые сочетания клавиш

-- После загрузки плагинов — подключаем их конфиги
require('plugins.treesitter')
-- require('plugins.lsp')
-- require('plugins.cmp')
require('mini.animate').setup()
