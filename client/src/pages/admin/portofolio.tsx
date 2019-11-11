import React from 'react';
import ReactTooltip from 'react-tooltip';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import '../scss/admin/portofolio.scss';

import { SEO } from '../../components/seo';
import { AdminLayout } from '../../components/layout';
import { Project } from '../../components/Project';

import { usePortofolios } from '../../hooks/usePortofolios';

const Alert = withReactContent(Swal);

export const PortofolioForm = props => {
  const { portofolio } = props;

  const defaultValue = {
    title: (portofolio && portofolio.title) || '',
    description: (portofolio && portofolio.description) || '',
    platform: (portofolio && portofolio.platform) || '',
  };

  return (
    <div className="add-portofolio-form">
      <input type="text" id="title" placeholder="Nama proyek" defaultValue={defaultValue.title} />
      <input type="text" id="description" placeholder="Deskripsi Singkat" defaultValue={defaultValue.description} />
      <select name="platform" id="platform" defaultValue={defaultValue.platform}>
        <option value="web">Web</option>
        <option value="mobile">Mobile</option>
        <option value="desktop">Desktop</option>
      </select>
      <div className="img">
        <img src="https://via.placeholder.com/750x500" alt="Nama proyek" />
      </div>
    </div>
  );
};

const PortofolioManagement = () => {
  const { portofolios, addNewPortofolio, editSelectedPortofolio, deleteSelectedPortofolio } = usePortofolios();

  const actionOpenAddPortofolioAlert = async () => {
    const alert = await Alert.fire({
      title: 'Tambah Portofolio',
      html: <PortofolioForm />,
      showCancelButton: true,
      confirmButtonColor: 'var(--tertiary)',
      confirmButtonText: 'Tambahkan',
      preConfirm: () => {
        const titleInput = document.getElementById('title') as HTMLInputElement;
        const descriptionInput = document.getElementById('description') as HTMLInputElement;
        const platformInput = document.getElementById('platform') as HTMLSelectElement;

        return {
          title: titleInput.value,
          description: descriptionInput.value,
          platform: platformInput.value,
          imageUrl: 'https://via.placeholder.com/750x500',
        };
      },
    });

    if (alert.value) {
      await addNewPortofolio(alert.value);
      await Alert.fire('Sukses!', 'Portofolio berhasil ditambahkan', 'success');
    }
  };

  const actionOpenEditPortofolioAlert = async (index: number) => {
    const alert = await Alert.fire({
      title: 'Edit Portofolio',
      html: <PortofolioForm portofolio={portofolios[index]} />,
      showCancelButton: true,
      confirmButtonColor: 'var(--tertiary)',
      confirmButtonText: 'Update',
      preConfirm: () => {
        const titleInput = document.getElementById('title') as HTMLInputElement;
        const descriptionInput = document.getElementById('description') as HTMLInputElement;
        const platformInput = document.getElementById('platform') as HTMLSelectElement;

        return {
          title: titleInput.value,
          description: descriptionInput.value,
          platform: platformInput.value,
          imageUrl: 'https://via.placeholder.com/750x500',
        };
      },
    });

    if (alert.value) {
      await editSelectedPortofolio({ ...portofolios[index], ...alert.value });
      await Alert.fire('Sukses!', 'Portofolio berhasil diubah', 'success');
    }
  };

  return (
    <div className="portofolio-management">
      <h1>
        <span>Portofolio</span>
      </h1>
      <div className="projects">
        {portofolios.map((portofolio, index) => (
          <Project
            {...portofolio}
            admin
            key={index}
            editPortofolio={() => actionOpenEditPortofolioAlert(index)}
            removePortofolio={(_id: string) => deleteSelectedPortofolio(_id)}
          />
        ))}
        <button
          className="add-portofolio-btn"
          data-tip="Tambah portofolio"
          data-for="portofolio-add"
          onClick={actionOpenAddPortofolioAlert}
        >
          <FontAwesomeIcon icon={faPlus} size="1x" />
        </button>
        <ReactTooltip place="left" type="dark" effect="solid" id="portofolio-add" />
      </div>
    </div>
  );
};

const AdminPage = () => {
  return (
    <AdminLayout>
      <SEO title="Admin" />
      <PortofolioManagement />
    </AdminLayout>
  );
};

export default AdminPage;
