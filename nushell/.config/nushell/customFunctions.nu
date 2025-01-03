export def sshAgentWrapper [] {
  let sshAgentTable = ssh-agent 
      | lines 
      | first 2 
      | reduce -f {} {|it, acc| 
        let listt = $it 
          | split row "; "
          | get 0
          | split row "="
        $acc | insert $listt.0 $listt.1 
      }
  export-env { $env.SSH_AUTH_SOCK = $sshAgentTable.SSH_AUTH_SOCK }
  export-env { $env.SSH_AGENT_PID = $sshAgentTable.SSH_AGENT_PID }
}

export def applyDockMode [] {
  xrandr --output DisplayPort-0 --mode 2560x1080;
}

export def applyDeckMode [] {
  xrandr --output Virtual-1 --mode 1280x800;
}
