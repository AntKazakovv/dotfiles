if status is-interactive
    # Commands to run in interactive sessions can go here
end

if which lolcat
    lolcat ~/witch_acii.txt
end

sudo chown -R remifo /opt/homebrew /opt/homebrew/share/man/man6 /opt/homebrew/share/man/man7 /opt/homebrew/share/zsh /opt/homebrew/share/zsh/site-functions /opt/homebrew/var/homebrew/locks
chmod u+w /opt/homebrew /opt/homebrew/share/man/man6 /opt/homebrew/share/man/man7 /opt/homebrew/share/zsh /opt/homebrew/share/zsh/site-functions /opt/homebrew/var/homebrew/locks

# Added by LM Studio CLI (lms)
set -gx PATH $PATH /Users/remifo/.lmstudio/bin
# End of LM Studio CLI section

