import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import Select, { Styles } from 'react-select';

import './scss/portofolio.scss';

import { Layout } from '../components/layout';
import { SEO } from '../components/seo';
import { Project } from '../components/Project';

import { selectOptions } from '../data/portofolio';
import { IPortofolio } from '../interfaces/portofolio';

import { usePortofolios } from '../hooks/usePortofolios';
import Spinner from '../components/Spinner';

const selectStyles: Styles = {
  placeholder: base => ({ ...base, color: 'var(--tertiary)' }),
  container: base => ({
    ...base,
    outline: 'none',
  }),
  control: base => ({
    ...base,
    border: '2px solid var(--tertiary)',
    outline: 'none',
    boxShadow: 'none',
    ':hover': { border: '2px solid var(--tertiary)' },
  }),
  multiValue: base => ({ ...base, color: 'white', backgroundColor: 'var(--primary)' }),
  multiValueLabel: base => ({ ...base, color: 'white', fontSize: 14 }),
  multiValueRemove: base => ({ ...base, ':hover': { backgroundColor: 'var(--secondary)' } }),
};

const Portfolio = () => {
  const [filters, setFilters] = useState([]);
  const [displayedPortofolios, setDisplayedPortofolios] = useState<IPortofolio[]>([]);

  const { portofolios } = usePortofolios();

  useEffect(() => {
    setDisplayedPortofolios(portofolios);
  }, [portofolios]);

  useEffect(() => {
    if (!filters || filters.length === 0) setDisplayedPortofolios(portofolios);
    else
      setDisplayedPortofolios(
        portofolios.filter(portofolio => filters.map(filter => filter.value).includes(portofolio.platform)),
      );
  }, [filters, portofolios]);

  const renderTitle = () => (
    <h1 className="section">
      <span>Karya Kami</span>
    </h1>
  );

  const renderComingSoon = () => (
    <h1 className="section">
      <span>Coming Soon...</span>
    </h1>
  );

  const renderFilter = () => {
    return (
      <div className="section filters">
        <h4>Platform: </h4>
        <Select
          value={filters}
          onChange={selectedOption => setFilters(selectedOption)}
          options={selectOptions}
          isMulti
          isSearchable={false}
          className="select"
          styles={selectStyles}
        />
      </div>
    );
  };

  const renderProjects = () => {
    const renderContent = () => {
      if (displayedPortofolios === null) {
        return <Spinner />;
      }
      if (displayedPortofolios.length === 0) {
        return <p>Tidak ada portofolio yang dapat ditampilkan</p>;
      }
      return displayedPortofolios.map((project, index) => <Project {...project} key={index} />);
    };

    return <div className="section projects">{renderContent()}</div>;
  };

  const renderOffer = () => (
    <div className="section offer">
      <h2>Ingin ide kamu direalisasikan juga?</h2>
      <Link to="/request">
        <button>Request Disini</button>
      </Link>
    </div>
  );

  return (
    <Layout>
      <SEO title="Portofolio" />
      <section className="portofolio">
        {/* {renderTitle()} */}
        {renderComingSoon()}
      </section>
    </Layout>
  );
};

export default Portfolio;
