import subprocess

# The command to run inside the new terminal
command = 'cd ~/Raspberry-Pi-Website && python3 webhook_listener.py'

# Open a new LXTerminal and run the command
subprocess.Popen(['lxterminal', '-e', f'bash -c "{command}; exec bash"'])