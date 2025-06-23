return {
    'numToStr/Comment.nvim',
    opts = {
        mappings = {
            basic = true,            -- включает gc, gcc
            extra = false,           -- отключает gco, gcO и др.
        },
        toggler = {
            line = "<leader>c",      -- комментировать/раскомментировать строку
            block = "<leader>C",     -- для блока
        },
        opleader = {
            line = "<leader>c",
            block = "<leader>C",
        }
    }
}
