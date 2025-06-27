local km = vim.keymap.set
vim.g.mapleader = " "  -- пробел как leader
local builtin = require('telescope.builtin')

-- Быстрый доступ к дереву файлов
km("n", "<leader>e", ":NvimTreeToggle<CR>", { silent = true, desc = "Open tree-browser" })

-- Перемещение по окнам
km("n", "<C-h>", "<C-w>h")
km("n", "<C-j>", "<C-w>j")
km("n", "<C-k>", "<C-w>k")
km("n", "<C-l>", "<C-w>l")

-- Window vertical movement
km('n', '<pageup>', '<c-u>', { noremap = true, silent = true })
km('n', '<PageDown>', '<C-d>', { noremap = true, silent = true })


-- vim.keyap.set("v", "<", "<gv" { noremap = true })
-- vim.keymap.set("v", ">", ">gv", { noremap = true })
km("n", "d", "x", { noremap = true})
km("n", "x", "V", { noremap = true})
km("v", "x", "j", { noremap = true})

km("n", "<A-s>", ":w<CR>")

-- Plugins --
-- km("n", "<leader>f", ":Telescope file_browser<CR>")
km('n', '<leader>f', builtin.find_files, {desc = "Helix-like file picker"})
---- Tabs
km("n", "<leader>,", "<Cmd>BufferPrevious<CR>", {desc = "Prev tab", silent = true})
km("n", "<leader>.", "<Cmd>BufferNext<CR>", {desc = "Next tab", silent = true})
km("n", "<leader>d", "<Cmd>Trouble diagnostics toggle<CR>", { desc = "Open errors list" })

km("n", "gd", vim.lsp.buf.definition, { buffer = bufnr, desc = "Go to definition" })
km('n', ':', '<cmd>FineCmdline<CR>', {noremap = true})
km('n', '<leader>b', "<Cmd>BufferLinePick<CR>", {desc = "Pick buffer"})


