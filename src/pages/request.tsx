import React, { useState, useEffect } from 'react';
import MaskedInput from 'react-text-mask';
import emailMask from 'text-mask-addons/dist/emailMask';
import { Element, scroller } from 'react-scroll';
import axios from 'axios';
import dayjs from 'dayjs';

import './scss/request.scss';

import { Layout } from '../components/layout';
import { SEO } from '../components/seo';
import Spinner from '../components/Spinner';
import { Alert } from '../components/Alert';

import { notices, questions, contacts } from '../data/request';

import { useRequestReducer } from '../reducers/request';
import { isMobile, isQuestionConditionNotFulfilled } from '../helpers/request';
import { validateEmail, validatePhoneNumber } from '../helpers/validation';

const InputField = props => {
  const { label, id, type, options, condition, hasCustomInput, isRequired, reducer, setWarning } = props;
  const [state, dispatch] = reducer;

  const actionTextInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    dispatch({ type: id, payload: event.target.value });
  };

  const actionScrollToNextInput = () => {
    const filteredQuestions = questions.filter(question => {
      if (isQuestionConditionNotFulfilled(question.condition, state)) return false;
      return true;
    });

    const currentQuestionIndex = filteredQuestions.findIndex(question => question.id === id);

    const nextQuestion = filteredQuestions[currentQuestionIndex + 1];
    let nextQuestionKey: string;
    let nextQuestionType: string;

    // It has reached last question
    if (!nextQuestion) {
      nextQuestionKey = 'submit-btn';
      nextQuestionType = 'button';
    } else {
      nextQuestionKey = nextQuestion.id;
      nextQuestionType = nextQuestion.type;
    }

    const nextQuestionElement = document.getElementById(nextQuestionKey);

    scroller.scrollTo(nextQuestionKey, {
      duration: 1000,
      smooth: true,
      offset: Math.max(
        -(window.innerHeight * 0.5 - nextQuestionElement.clientHeight * 0.5),
        -(window.innerHeight * 0.25),
      ),
    });

    if (
      (nextQuestionElement instanceof HTMLInputElement ||
        nextQuestionElement instanceof HTMLTextAreaElement ||
        nextQuestionElement.id === 'submit-btn') &&
      nextQuestionType !== 'radio' &&
      nextQuestionType !== 'checkbox' &&
      !isMobile()
    ) {
      nextQuestionElement.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.currentTarget.blur();
      actionScrollToNextInput();
    }
  };

  const renderField = () => {
    switch (type) {
      case 'text':
        return (
          <input
            type="text"
            id={id}
            name={id}
            placeholder="Ketik jawaban disini..."
            autoComplete="off"
            value={state[id]}
            spellCheck={false}
            onChange={event => actionTextInputChange(event)}
            onKeyDown={handleKeyDown}
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
            spellCheck={false}
            value={state[id]}
            onChange={event => actionTextInputChange(event)}
            onKeyDown={handleKeyDown}
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
            spellCheck={false}
            value={state[id]}
            onChange={event => actionTextInputChange(event)}
            onKeyDown={handleKeyDown}
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
            spellCheck={false}
            value={state[id]}
            onChange={event => actionTextInputChange(event)}
            onKeyDown={handleKeyDown}
          />
        );
      case 'radio': {
        const actionRadioClicked = option => {
          dispatch({ type: id, payload: option });
          actionScrollToNextInput();
        };

        return (
          <div className={`options ${options.length > 2 && 'multiline'}`} id={id}>
            {options.map((option, index) => (
              <button
                type="button"
                key={index}
                onClick={() => actionRadioClicked(option)}
                className={`option ${state[id] === option ? 'selected' : ''}`}
              >
                {option}
              </button>
            ))}
            {hasCustomInput && (
              <input
                type="text"
                className="custom-input"
                name={id}
                placeholder="Jawaban lain..."
                autoComplete="off"
                spellCheck={false}
                value={options.includes(state[id]) ? '' : state[id]}
                onChange={event => actionTextInputChange(event)}
                onKeyDown={handleKeyDown}
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
          // Remove custom value so it won't duplicate as user types new value
          let stateWithPredefinedOnly = state[id].filter(choosenValue => options.includes(choosenValue));

          if (value) {
            return dispatch({ type: id, payload: [...stateWithPredefinedOnly, value] });
          }
          //   Remove custom value if the input value is blank
          dispatch({ type: id, payload: stateWithPredefinedOnly });
        };

        return (
          <div className={`options ${options.length > 2 && 'multiline'}`} id={id}>
            {options.map((option, index) => (
              <button
                type="button"
                key={index}
                onClick={() => checkboxClicked(option)}
                className={`option ${state[id] && state[id].includes(option) ? 'selected' : ''}`}
                onKeyDown={handleKeyDown}
              >
                {option}
              </button>
            ))}
            {hasCustomInput && (
              <input
                type="text"
                className="custom-input"
                name={id}
                placeholder="Jawaban lain..."
                autoComplete="off"
                spellCheck={false}
                onChange={event => checkboxCustomInput(event.target.value)}
                onKeyDown={handleKeyDown}
              />
            )}
          </div>
        );
      }
    }
  };

  const renderButton = () => {
    if (type === 'radio' && hasCustomInput !== true) return;

    return (
      <div className={`input-btn ${!state[id] ? 'hide' : ''}`}>
        <button type="button" onClick={actionScrollToNextInput}>
          OK
        </button>
        <span>
          atau tekan <span className="enter">ENTER</span>
        </span>
      </div>
    );
  };

  const renderIsRequiredStar = () => {
    return isRequired ? <span className="required-star">*</span> : '';
  };

  if (isQuestionConditionNotFulfilled(condition, state)) return <></>;

  return (
    <Element name={id}>
      <div className="question">
        <label htmlFor={id}>
          {label} {renderIsRequiredStar()}
        </label>
        {renderField()}
        {renderButton()}
      </div>
    </Element>
  );
};

const Request = () => {
  const [state, dispatch] = useRequestReducer();
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    if (state.email !== '' && !validateEmail(state.email)) {
      setWarning(previousWarning => ({ ...previousWarning, email: '* email is invalid' }));
    } else {
      setWarning(previousWarning => {
        const newWarning = { ...previousWarning };
        delete newWarning.email;
        return newWarning;
      });
    }

    if (state.whatsapp !== '' && !validatePhoneNumber(state.whatsapp)) {
      setWarning(previousWarning => ({ ...previousWarning, whatsapp: '* phone number is invalid' }));
    } else {
      setWarning(previousWarning => {
        const newWarning = { ...previousWarning };
        delete newWarning.whatsapp;
        return newWarning;
      });
    }
  }, [state]);

  const actionSubmitForm = async () => {
    try {
      const url =
        'https://script.google.com/macros/s/AKfycbyChXp-0L58-N4B6IBfE_wo96-rJsmZnQ8Qw-H_QVtDd_6xpYi3oeWy4HHBDnLXvII/exec';

      const getParams = () => {
        const params = { MANPRO: '', Timestamp: dayjs().format('M/D/YYYY hh:mm:ss') };

        for (let key in state) {
          const questionIndex = questions.findIndex(question => question.id === key);
          const question = questions[questionIndex];
          if (question.shouldRecorded === false) continue;

          if (Array.isArray(state[key])) {
            params[question.column] = state[key].join(', ');
          } else if (state[key].startsWith('0')) {
            params[question.column] = `'${state[key]}`;
          } else {
            params[question.column] = state[key];
          }
        }

        return params;
      };

      const notifyLineBot = async data => {
        try {
          await axios({
            method: 'POST',
            url: 'https://botmanpro.inkubatorit.com/api/project_request/',
            data: state,
          });
        } catch (error) {
          // catch and ignore error if linebot is down as long as data received in sheet
        }
      };

      setLoading(true);
      const [response] = await Promise.all([
        axios({
          method: 'GET',
          url,
          params: getParams(),
        }),
        notifyLineBot(state),
      ]);

      setLoading(false);
      if (response) {
        dispatch({ type: 'RESET' });
        Alert.fire({
          icon: 'success',
          title: 'Sukses Disubmit',
          html: (
            <div style={{ lineHeight: 1.75 }}>
              <p>Kami akan mereview aplikasi proyek terlebih dahulu</p>
              <p>Kemudian project manager kami akan segera mengontak Anda untuk memberitahukan tahap selanjutnya</p>
            </div>
          ),
          footer: <p style={{ lineHeight: 1.5 }}>Hubungi kontak dibawah formulir jika Anda memiliki pertanyaan</p>,
        });
      } else {
        throw new Error('failed');
      }
    } catch {
      setLoading(false);
      Alert.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Terjadi kesalahan!',
      });
    }
  };

  const allRequireFilled = () => {
    return questions.every(question => {
      if (question.isRequired) {
        if (question.condition) {
          if (isQuestionConditionNotFulfilled(question.condition, state)) return true;
        }

        if (Array.isArray(state[question.id])) return state[question.id].length;
        return !!state[question.id];
      }
      return true;
    });
  };

  const isWarningExist = () => {
    return Object.entries(warning).length > 0;
  };

  const ableToSubmit = () => {
    return allRequireFilled() && !isWarningExist();
  };

  const renderWarning = () => {
    if (!isWarningExist()) return;

    return (
      <div className="warning">
        {Object.entries(warning).map(([id, text], index) => (
          <p key={id}>{text}</p>
        ))}
      </div>
    );
  };

  const renderContact = () => {
    return (
      <div className="contact">
        <h3>Hubungi kami jika Anda memiliki pertanyaan atau kebutuhan segera:</h3>
        {contacts.map((contact, index) => (
          <h3 key={index}>
            {index + 1}. {contact}
          </h3>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <SEO title="Request a Project" />
      {loading && <Spinner />}
      <div className="request">
        <div className="title">
          <span>Formulir Pengajuan Proyek</span>
          {notices.map((notice, index) => (
            <h3 key={index}>{notice}</h3>
          ))}
        </div>
        {questions.map((question, index) => (
          <InputField key={index} {...question} reducer={[state, dispatch]} setWarning={setWarning} />
        ))}
        <Element name="submit-btn">
          <div className="submit-btn">
            <button id="submit-btn" disabled={!ableToSubmit()} onClick={actionSubmitForm}>
              SUBMIT
            </button>
          </div>
        </Element>
        {renderWarning()}
        {renderContact()}
      </div>
    </Layout>
  );
};

export default Request;
