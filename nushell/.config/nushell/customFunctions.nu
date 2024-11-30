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
