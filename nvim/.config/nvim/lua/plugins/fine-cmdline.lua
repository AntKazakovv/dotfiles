return {
  'VonHeikemen/fine-cmdline.nvim',
  dependencies = {
    {'MunifTanjim/nui.nvim'}
  },
  config = function()
    require('fine-cmdline').setup({
      cmdline = {
        enable_keymaps = true,
        smart_history = true,
        prompt = '> '
      },
      popup = {
        position = {
          row = '20%',
          col = '50%',
        },
        size = {
          width = '50%',
          height = '5%'
        },
        border = {
          padding = { 1, 1 },
          style = {
            top_left    = " ", top    = " ",    top_right = " ",
            left        = " ",                      right = " ",
            bottom_left = " ", bottom = "─", bottom_right = " ",
          },
        },
        win_options = {
          winhighlight = 'Normal:Normal,FloatBorder:FloatBorder',
        },
      },
      hooks = {
        before_mount = function(input)
          -- code
        end,
        after_mount = function(input)
          -- code
        end,
        set_keymaps = function(imap, feedkeys)
          -- code
        end
      }
    })
  end
}
