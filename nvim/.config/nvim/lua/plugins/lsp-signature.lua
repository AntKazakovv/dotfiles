return {
    "ray-x/lsp_signature.nvim", config = function()
    require("lsp_signature").setup({
      bind = true,
      handler_opts = { border = "rounded" },
      floating_window = true,
      hint_prefix = "🐣 ",
      hi_parameter = "Search",
    })
  end
}
