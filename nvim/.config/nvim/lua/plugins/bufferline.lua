return {
  'akinsho/bufferline.nvim',
  version = "*",
  dependencies = 'nvim-tree/nvim-web-devicons',
  -- config = function ()
  --   require('bufferline').setup({
  --     indicator = {
  --         style = 'underline',
  --     },
  --   })
  -- end
  opts = {
    options = {
      diagnostics = "nvim_lsp",
    }
  }
}
