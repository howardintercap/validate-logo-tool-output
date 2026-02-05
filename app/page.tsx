import LogoGenerator from './components/logo-generator';

export default function Home() {
  return (
    <main className="logo-page">
      <div className="logo-page__container">
        <h1 className="logo-page__title">Logo brief</h1>
        <LogoGenerator />
      </div>
    </main>
  );
}