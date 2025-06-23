-- Инициализация mason
require("mason").setup()
require("mason-lspconfig").setup {
  ensure_installed = {
    "angularls",     -- Angular
    "ts_ls",      -- TypeScript / JavaScript
    "html",          -- HTML
    "cssls",         -- CSS, SCSS
  }
}

-- Настройки для каждого сервера
local lspconfig = require("lspconfig")

-- Angular
lspconfig.angularls.setup{
  on_new_config = function(new_config, new_root_dir)
    -- Необходим для корректной работы Angular Language Server
    new_config.cmd = {
      "ngserver",
      "--stdio",
      "--tsProbeLocations", vim.fn.getcwd().."/node_modules/typescript/lib",
      "--ngProbeLocations", vim.fn.getcwd().."/node_modules/@angular/language-server"
    }
    new_config.on_new_config = nil
  end,
  filetypes = { "typescript", "html", "typescriptreact", "typescript.tsx" },
  root_dir = lspconfig.util.root_pattern("angular.json", "project.json"),
}

-- TypeScript / JavaScript
lspconfig.ts_ls.setup{}

-- HTML
lspconfig.html.setup{}

-- CSS / SCSS
lspconfig.cssls.setup{
  settings = {
    css = { validate = true },
    scss = { validate = true },
    less = { validate = true },
  }
}

vim.diagnostic.config({
  virtual_text = {
    prefix = '●',    -- символ перед текстом
    spacing = 2,
    source = "if_many",
  },
  signs = true,
  underline = true,
  update_in_insert = false,
  severity_sort = true,
  float = {
    source = "always",
    border = "rounded",
    header = "",
    prefix = "",
  },
})

vim.o.updatetime = 250

vim.api.nvim_create_autocmd({ "CursorHold", "CursorHoldI" }, {
  callback = function()
    vim.diagnostic.open_float(nil, { focus = false, scope = "cursor" })
  end,
})
