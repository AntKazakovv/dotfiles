require('nvim-treesitter.configs').setup {
  ensure_installed = {
    "lua", "python", "javascript", "typescript", "html", "css",
    "markdown", -- добавлено
    "vim", "help"
  },
  highlight = { enable = true },
  indent = { enable = true }
}
