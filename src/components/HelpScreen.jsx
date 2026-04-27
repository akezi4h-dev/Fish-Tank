import './HelpScreen.css'

const SECTIONS = [
  {
    title: 'What is Tide Lines?',
    content: 'Tide Lines is a shared fish tank where each fish is a message from someone you love. Every fish swimming in your tank was sent by a real person — a friend, a family member, someone far away. The tank stays with you, ambient and alive, so connection feels like presence rather than pressure.',
  },
  {
    title: 'How to add a fish',
    steps: [
      'Tap a tank card to open it',
      'Tap the + button at the bottom of the tank',
      'Choose a fish type and color, then write your message and your name',
      'Tap Release to send your fish swimming in the tank',
    ],
  },
  {
    title: 'How to join a tank',
    steps: [
      'Ask a tank owner to tap ⊕ on their tank card to open the invite panel',
      'They can copy the invite link and share it with you',
      'Paste the code into the Join field on the login screen or Home screen',
      "You'll see the tank in your grid right away",
    ],
  },
  {
    title: 'How fish messages work',
    steps: [
      'Fish swim freely around the tank on their own',
      'Tap any fish to stop it in place and read the message it carries',
      'Tap the fish again — or tap anywhere on the background — to release it',
      'A red dot on a tank card means someone added a fish since your last visit',
    ],
  },
]

export default function HelpScreen() {
  return (
    <div className="help-page">
      <h2 className="help-heading">How it works</h2>
      {SECTIONS.map(s => (
        <div key={s.title} className="help-section">
          <h3 className="help-section-title">{s.title}</h3>
          {s.content && <p className="help-text">{s.content}</p>}
          {s.steps && (
            <ol className="help-steps">
              {s.steps.map((step, i) => (
                <li key={i} className="help-step">{step}</li>
              ))}
            </ol>
          )}
        </div>
      ))}
    </div>
  )
}
