import { useEffect } from 'react';
import logo from '../assets/logo.png';
import profilePhoto from '../assets/perfil.jpeg';

const clinicPhone = '5592991191665';
const whatsappMessage = encodeURIComponent(
  'Olá, gostaria de agendar uma consulta com a psicóloga Josana Sequeira.',
);
const whatsappUrl = `https://wa.me/${clinicPhone}?text=${whatsappMessage}`;
const addressMapsUrl = 'https://www.google.com/maps/search/?api=1&query=Rua%20Leonardo%20Malcher%2C%201948%2C%20Centro%2C%20Manaus%2C%20AM%2C%2069020-070';

const focusKeyword = 'Psicóloga em Manaus';
const professionalName = 'Josana de Lima Sequeira';
const professionalRegistration = 'CRP 20/02918';

const services = [
  {
    icon: 'bi-cloud-rain-heavy',
    title: 'Ansiedade, estresse e pânico',
    text: 'Atendimento para sintomas emocionais intensos, organização da rotina e construção de estratégias de enfrentamento.',
  },
  {
    icon: 'bi-heart-pulse',
    title: 'Depressão, luto e autoestima',
    text: 'Escuta clínica para fases difíceis, perdas, desânimo persistente e fortalecimento da qualidade de vida.',
  },
  {
    icon: 'bi-chat-dots',
    title: 'Relacionamentos e crenças limitantes',
    text: 'Cuidado para conflitos afetivos, padrões de comportamento, dependência emocional e desenvolvimento pessoal.',
  },
];

const clinicalTopics = [
  'Alienação Parental',
  'Alteração de Humor',
  'Ansiedade',
  'Bipolaridade',
  'Bullying',
  'Depressão Pós-Parto',
  'Transtorno do Pânico',
  'Transtorno Obsessivo-Compulsivo (TOC)',
];

const audiences = ['Crianças', 'Adolescentes', 'Adultos', 'Casais'];

const credentials = [
  `${professionalName}, ${professionalRegistration}.`,
  '18 anos de formação e experiência em Psicologia Clínica e Organizacional.',
  'Ênfase em Terapia Cognitivo-Comportamental e Neuropsicologia.',
  'Atendimento presencial em Manaus e atendimento psicológico online.',
];

const contactItems = [
  {
    icon: 'bi-whatsapp',
    label: 'WhatsApp',
    value: '+55 92 99119-1665',
    href: whatsappUrl,
  },
  {
    icon: 'bi-envelope',
    label: 'E-mail',
    value: 'clinicailuminamente@gmail.com',
    href: 'mailto:clinicailuminamente@gmail.com',
  },
  {
    icon: 'bi-geo-alt',
    label: 'Endereço',
    value: 'Rua Leonardo Malcher, 1948, Centro, Manaus',
    href: addressMapsUrl,
  },
];

const socialLinks = [
  {
    label: 'Josana Sequeira',
    href: 'https://www.instagram.com/josanasequeira?igsh=MTQ0YTlmdG90M2xiaA==',
  },
  {
    label: 'Clínica Iluminamente',
    href: 'https://www.instagram.com/clinica.iluminamente?igsh=MWFnanh4OHVzaWkyNg==',
  },
];

function formatDate(dateValue) {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(`${dateValue}T12:00:00`));
}

function Header() {
  return (
    <header className="site-header fixed-top">
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid px-3 px-lg-4">
            <a className="navbar-brand d-flex align-items-center gap-2" href="#inicio" aria-label="Josana Sequeira Psicóloga">
              <img src={logo} alt="Logo Josana Sequeira Psicóloga" className="brand-logo" />
              <span>Josana Sequeira</span>
            </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Abrir menu"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
              <li className="nav-item">
                <a className="nav-link" href="#sobre">Sobre</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#servicos">Atendimentos</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#contato">Contato</a>
              </li>
              <li className="nav-item">
                <a className="btn btn-primary-soft" href={whatsappUrl} target="_blank" rel="noreferrer">
                  Agendar consulta
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

function LandingPage() {
  return (
    <>
      <main id="inicio">
        <section className="hero-section professional-hero">
          <div className="container hero-content">
            <div className="row align-items-center g-5">
              <div className="col-lg-7 col-xl-6" data-reveal="left">
                <p className="section-kicker">Psicóloga em Manaus</p>
                <h1>Josana Sequeira</h1>
                <p className="professional-id">{professionalName}, {professionalRegistration}</p>
                <p className="hero-copy">
                  Atendimento psicológico presencial e online para ansiedade, depressão,
                  relacionamentos, luto e desenvolvimento emocional, com base em Terapia
                  Cognitivo-Comportamental e Neuropsicologia.
                </p>
                <div className="hero-badges" aria-label="Modalidades de atendimento">
                  <span>Presencial</span>
                  <span>Online</span>
                  <span>TCC</span>
                  <span>Neuropsicologia</span>
                </div>
                <div className="d-flex flex-column flex-sm-row gap-3">
                  <a className="btn btn-primary btn-lg" href={whatsappUrl} target="_blank" rel="noreferrer">
                    <i className="bi bi-calendar-check me-2" aria-hidden="true" />
                    Agendar consulta
                  </a>
                </div>
              </div>
              <div className="col-lg-5 col-xl-6" data-reveal="right">
                <div className="profile-frame">
                  <img
                    src={profilePhoto}
                    alt="Psicóloga Josana Sequeira"
                    className="profile-photo"
                    width="520"
                    height="520"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="intro-band" id="sobre">
          <div className="container">
            <div className="row align-items-center g-4">
              <div className="col-lg-5" data-reveal="left">
                <p className="section-kicker">Quem sou</p>
                <h2>Psicóloga clínica para cuidado emocional com método, sigilo e acolhimento.</h2>
              </div>
              <div className="col-lg-7" data-reveal="right">
                <p className="section-text">
                  Sou {professionalName}, psicóloga formada há 18 anos, com atuação na Psicologia
                  Clínica e Organizacional. Auxilio pessoas a desenvolverem recursos emocionais,
                  ampliarem qualidade de vida e cuidar da saúde mental com responsabilidade.
                </p>
                <div className="credential-list">
                  {credentials.map((item) => (
                    <span key={item}>
                      <i className="bi bi-check2-circle" aria-hidden="true" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-pad" id="servicos">
          <div className="container">
            <div className="section-heading text-center mx-auto" data-reveal="up">
              <p className="section-kicker">Serviços psicológicos</p>
              <h2>Atendimento psicológico para diferentes fases da vida.</h2>
            </div>
            <div className="row g-4 mt-2">
              {services.map((service) => (
                <div className="col-md-6 col-lg-4" key={service.title} data-reveal="up">
                  <article className="service-card h-100">
                    <div className="service-icon">
                      <i className={`bi ${service.icon}`} aria-hidden="true" />
                    </div>
                    <h3>{service.title}</h3>
                    <p>{service.text}</p>
                  </article>
                </div>
              ))}
            </div>
            <div className="clinical-topics" data-reveal="up">
              <p className="section-kicker">Demandas atendidas</p>
              <div className="topic-list" aria-label="Demandas psicológicas atendidas">
                {clinicalTopics.map((topic) => (
                  <span key={topic}>{topic}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="care-band">
          <div className="container">
            <div className="row g-4 align-items-center">
              <div className="col-lg-6" data-reveal="left">
                <p className="section-kicker">Público-alvo</p>
                <h2>Atendimento para crianças, adolescentes, adultos e casais.</h2>
              </div>
              <div className="col-lg-6" data-reveal="right">
                <div className="audience-grid">
                  {audiences.map((audience) => (
                    <span key={audience}>{audience}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-pad contact-section" id="contato">
          <div className="container">
            <div className="row g-5 align-items-center">
              <div className="col-lg-6" data-reveal="left">
                <p className="section-kicker">Contato</p>
                <h2>Agende uma consulta com a psicóloga Josana Sequeira.</h2>
                <p className="section-text">
                  Atendimento presencial em Manaus e atendimento online com hora marcada. Entre em
                  contato para verificar disponibilidade e escolher o melhor formato.
                </p>
                <a className="btn btn-primary btn-lg" href={whatsappUrl} target="_blank" rel="noreferrer">
                  <i className="bi bi-calendar-check me-2" aria-hidden="true" />
                  Agendar consulta
                </a>
              </div>
              <div className="col-lg-6" data-reveal="right">
                <div className="contact-list">
                  {contactItems.map((item) => (
                    <a
                      className="contact-item"
                      href={item.href}
                      target={item.label === 'Endereço' ? '_blank' : undefined}
                      rel={item.label === 'Endereço' ? 'noreferrer' : undefined}
                      key={item.label}
                    >
                      <i className={`bi ${item.icon}`} aria-hidden="true" />
                      <span>
                        <strong>{item.label}</strong>
                        {item.value}
                      </span>
                    </a>
                  ))}
                  <div className="social-follow" aria-label="Redes sociais">
                    <strong>Nos siga nas redes</strong>
                    <div className="social-links">
                      {socialLinks.map((link) => (
                        <a href={link.href} target="_blank" rel="noreferrer" key={link.label}>
                          <i className="bi bi-instagram" aria-hidden="true" />
                          <span>{link.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container d-flex flex-column flex-md-row justify-content-between gap-2">
          <span>{professionalName} - {professionalRegistration}</span>
          <span>{focusKeyword} com atendimento presencial e online.</span>
        </div>
      </footer>

      <a
        className="whatsapp-float"
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar com a Iluminamente pelo WhatsApp"
      >
        <i className="bi bi-whatsapp" aria-hidden="true" />
      </a>
    </>
  );
}

function App() {
  useEffect(() => {
    const animatedElements = document.querySelectorAll('[data-reveal]');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 },
    );

    animatedElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header />
      <LandingPage />
    </>
  );
}

export default App;
