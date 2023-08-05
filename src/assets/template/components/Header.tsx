export const TemplateHeader = () => (
  <header>
    <nav>
      <ul>
        <li>
          <button id='theme-toggler'>🔆</button>
        </li>
        <li>
          <a href='/feeds/'>Feeds</a>
        </li>
        <li>
          <a href='/feeds/topics/'>Topics</a>
        </li>
        <li className='goto-homepage'>
          <span>|</span>
          <a href='/'>Homepage</a>
        </li>
      </ul>
    </nav>
  </header>
);
