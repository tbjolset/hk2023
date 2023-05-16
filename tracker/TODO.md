## For 2024

Server:
- Possible to start/stop enforcing live mode

UI
- Extrapolate and animate runner positions
- Distance from runners to user's current position
- Build stage list into app (not a separate place)
- Estimated time to stages and finish line
- Pulse on markers when active data, red rotating circle when old data
- Height plot
- Show better clustering when avatars are overlapping

Consise data structure for next time (in one json file):

{
  teams: [
    {
      id: 'cisco1',
      name: 'Cisco 1 Pro',
      trackerId: 'DJAKD23K',
      starting: '15:00',
      meeting: '13:30',
      teamColor: 'red',
      stages: [
        {
          id: 1,
          name: "Henrik Holstad',
          username: 'hholstad@cisco.com',
          avatar: '...url...',
        },
      ]
    }
  ]
}