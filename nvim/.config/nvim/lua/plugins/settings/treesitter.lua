require('nvim-treesitter.configs').setup {
  ensure_installed = {
    "lua", "python", "javascript", "typescript", "html", "css",
    "markdown", -- добавлено
    "vim",
    "vimdoc", 
  },
  highlight = { enable = true },
  indent = { enable = true }
}
