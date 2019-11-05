import React from 'react';
import MaskedInput from 'react-text-mask';
import emailMask from 'text-mask-addons/dist/emailMask';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Link, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll';

import './scss/request.scss';

import { Layout } from '../components/layout';
import { SEO } from '../components/seo';

import { notices, questions } from '../data/request';

import { useRequestReducer } from '../reducers/request';

const Alert = withReactContent(Swal);

const InputField = props => {
  const { label, id, type, options, condition, hasCustomInput, reducer } = props;
  const [state, dispatch] = reducer;

  const actionTextInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch({ type: id, payload: event.target.value });
  };

  const actionScrollToNextInput = () => {
    const currentQuestionIndex = questions.findIndex(question => question.id === id);
    const nextQuestionKey = questions[currentQuestionIndex + 1].id;

    scroller.scrollTo(nextQuestionKey, {
      duration: 1000,
      smooth: true,
      offset: -(window.innerHeight * 0.3),
    });
  };

  const getField = () => {
    switch (type) {
      case 'text':
        return (
          <input
            type="text"
            id={id}
            name={id}
            placeholder="Ketik jawaban disini..."
            autoComplete="off"
            value={state.id}
            onChange={event => actionTextInputChange(event)}
            onKeyDown={event => event.key === 'Enter' && actionScrollToNextInput()}
          />
        );
      case 'textarea':
        return (
          <textarea
            id={id}
            name={id}
            placeholder="Ketik jawaban disini..."
            rows={5}
            autoComplete="off"
            value={state.id}
            onChange={event => actionTextInputChange(event)}
            onKeyDown={event => event.key === 'Enter' && actionScrollToNextInput()}
          />
        );
      case 'date':
        return (
          <MaskedInput
            mask={[/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]}
            type="text"
            id={id}
            name={id}
            placeholder="dd/mm/yyyy"
            autoComplete="off"
            value={state.id}
            onChange={event => actionTextInputChange(event)}
            onKeyDown={event => event.key === 'Enter' && actionScrollToNextInput()}
          />
        );
      case 'email':
        return (
          <MaskedInput
            mask={emailMask}
            type="text"
            id={id}
            name={id}
            placeholder="example@gmail.com"
            autoComplete="off"
            value={state.id}
            onChange={event => actionTextInputChange(event)}
            onKeyDown={event => event.key === 'Enter' && actionScrollToNextInput()}
          />
        );
      case 'radio': {
        return (
          <div className={`options ${options.length > 2 && 'multiline'}`}>
            {options.map((option, index) => (
              <button
                type="button"
                key={index}
                onClick={() => dispatch({ type: id, payload: option })}
                className={`option ${state[id] === option ? 'selected' : ''}`}
              >
                {option}
              </button>
            ))}
            {hasCustomInput && (
              <input
                type="text"
                className="custom-input"
                id={id}
                name={id}
                placeholder="Jawaban lain..."
                autoComplete="off"
                value={options.includes(state[id]) ? '' : state[id]}
                onChange={event => actionTextInputChange(event)}
              />
            )}
          </div>
        );
      }
      case 'checkbox': {
        const checkboxClicked = option => {
          let newState;

          if (state[id] && state[id].includes(option)) {
            newState = state[id].filter(s => s !== option);
          } else {
            if (!state[id]) newState = [option];
            else newState = [...state[id], option];
          }

          dispatch({ type: id, payload: newState });
        };

        const checkboxCustomInput = value => {
          console.log({ state, value });

          if (state[id] && state[id].includes(value.slice(0, value.length - 1))) {
            const newState = state[id].filter(s => s !== value.slice(0, value.length - 1));

            dispatch({ type: id, payload: [...newState, value] });
          } else {
            if (!state[id]) dispatch({ type: id, payload: [value] });
            else dispatch({ type: id, payload: [...state[id], value] });
          }
        };

        return (
          <div className={`options ${options.length > 2 && 'multiline'}`}>
            {options.map((option, index) => (
              <button
                type="button"
                key={index}
                onClick={() => checkboxClicked(option)}
                className={`option ${state[id] && state[id].includes(option) ? 'selected' : ''}`}
              >
                {option}
              </button>
            ))}
            {hasCustomInput && (
              <input
                type="text"
                className="custom-input"
                id={id}
                name={id}
                placeholder="Jawaban lain..."
                autoComplete="off"
                onChange={event => checkboxCustomInput(event.target.value)}
              />
            )}
          </div>
        );
      }
    }
  };

  const getButton = () => {
    if (type === 'radio' && hasCustomInput !== true) return;

    return (
      <div>
        <button type="button" onClick={actionScrollToNextInput}>
          OK
        </button>
        <span>
          atau tekan <span className="enter">ENTER</span>
        </span>
      </div>
    );
  };

  if (condition && !Object.entries(condition).every(cond => state[cond[0]] === cond[1])) return <></>;

  return (
    <Element name={id}>
      <div className="question">
        <label htmlFor={id}>{label}</label>
        {getField()}
        {getButton()}
      </div>
    </Element>
  );
};

const Request = () => {
  const requestReducer = useRequestReducer();

  const actionSubmitForm = () => {
    const isSuccess = Math.random() > 0.5;
    if (isSuccess) {
      Alert.fire({
        type: 'success',
        title: 'Sip!',
        text: `Proyek berhasil disubmit`,
        footer: 'Tunggu kabar selanjutnya dari kami ya!',
      });
    } else {
      Alert.fire({
        type: 'error',
        title: 'Oops...',
        text: 'Terjadi kesalahan!',
      });
    }
  };

  return (
    <Layout>
      <SEO title="Request a Project" />
      <div className="request">
        <div className="title">
          <span>Formulir Pengajuan Proyek</span>
          {notices.map((notice, index) => (
            <h3 key={index}>{notice}</h3>
          ))}
        </div>
        {questions.map((question, index) => (
          <InputField key={index} {...question} reducer={requestReducer} />
        ))}
        <div className="submit-btn">
          <button onClick={actionSubmitForm}>SUBMIT</button>
        </div>
      </div>
    </Layout>
  );
};

export default Request;
