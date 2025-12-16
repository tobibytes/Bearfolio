const Footer = () => {
  return (
    <footer>
      <div className="container footer-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="brand-mark" />
          <strong>Bearfolio</strong>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <span>Design refresh preview</span>
          <span>·</span>
          <span>Built for Morgan students</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
