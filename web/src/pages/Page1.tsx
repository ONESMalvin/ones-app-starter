import React, { useCallback, useEffect, useState } from 'react';
import { ONES } from '@ones-open/sdk';

const initialCommands = [
  `ONES.fetchOpenAPI('/v2/project/projects?teamID=', {\n  method: 'GET',\n})`,
  `ONES.UI.toast({\n  type: 'info', title: 'hello Open Platform'\n})`,
  `ONES.UI.modal({\n  type: 'info', title: 'hello Open Platform'\n})`,
  'ONES.getLocale()',
  'ONES.getTimezone()',
  'ONES.getTeamInfo()',
];

const fetchOpenAPIIndex = initialCommands.findIndex((text) =>
  text.startsWith('ONES.fetchOpenAPI')
);

const formatForToast = (value: any) => {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch (error) {
    return String(value);
  }
};

const serializeResponse = async (response: any) => {
  const summary: any = {
    status: response.status,
    statusText: response.statusText,
  };

  try {
    const contentType = response.headers?.get?.('content-type') || '';
    if (contentType.includes('application/json')) {
      summary.body = await response.clone().json();
    } else {
      const text = await response.clone().text();
      summary.body = text.length > 500 ? `${text.slice(0, 500)}...` : text;
    }
  } catch (error) {
    return response;
  }

  return summary;
};

const normalizeToastValue = async (value: any) => {
  if (typeof value === 'object') {
    return serializeResponse(value);
  }
  return value;
};

const Page1: React.FC = () => {
  const [commandValues, setCommandValues] = useState<string[]>(() => [...initialCommands]);
  const [toastMessage, setToastMessage] = useState('Hello from ONES.UI.toast');
  const [modalMessage, setModalMessage] = useState('Hello from ONES.UI.modal');

  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).ONES && ONES) {
      (window as any).ONES = ONES;
    }
  }, []);

  const showToast = useCallback((message: any, type = 'info') => {
    const finalMessage = formatForToast(message);
    console.log(`[toast:${type}]`, finalMessage);
  }, []);

  useEffect(() => {
    if (fetchOpenAPIIndex === -1 || !ONES?.getTeamInfo) {
      return;
    }

    let cancelled = false;

    const fillTeamId = async () => {
      try {
        const info = await ONES.getTeamInfo();
        if (cancelled) return;
        const teamUUID = info?.teamUUID;
        if (!teamUUID) return;
        setCommandValues((prev: string[]) => {
          const nextCommand = `ONES.fetchOpenAPI('/v2/project/projects?teamID=${teamUUID}', {\n  method: 'GET',\n})`;
          if (prev[fetchOpenAPIIndex] === nextCommand) {
            return prev;
          }
          const next = [...prev];
          next[fetchOpenAPIIndex] = nextCommand;
          return next;
        });
      } catch (error: any) {
        showToast(error?.message || error, 'error');
        console.log('page1', 'getTeamInfo error', error);
      }
    };

    fillTeamId();

    return () => {
      cancelled = true;
    };
  }, [showToast]);

  const runCommand = (index: number) => {
    const expression = commandValues[index];
    if (!expression) return;
    const trimmedExpression = expression.trim();

    if (!trimmedExpression) {
      return;
    }

    const shouldToastResult =
      /^ONES\.get/.test(trimmedExpression) ||
      trimmedExpression.startsWith('ONES.fetchOpenAPI');

    const execute = async () => {
      try {
        const factory = new Function(
          'ONES',
          `return async function() { return ${expression}; }`
        );
        const fn = factory(ONES);
        const value = await fn();

        if (shouldToastResult) {
          const normalized = await normalizeToastValue(value);
          showToast(normalized);
          return;
        }

        console.log('page1', 'invoke', value);
      } catch (error: any) {
        showToast(error?.message || error, 'error');
        console.log('page1', 'error', error);
      }
    };

    execute();
  };

  const handleToastClick = () => {
    const content = toastMessage.trim() || '请输入要展示的内容';
    showToast(content);
  };

  const handleModalClick = async () => {
    const children = modalMessage.trim() || '请输入要展示的内容';
    console.log('[modal]', children);
  };

  return (
    <div className="page">
      <div id="test">Malvin test</div>
      <div className="sdk-actions">
        <section className="sdk-action">
          <label>
            Toast 内容
            <input
              type="text"
              value={toastMessage}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setToastMessage(event.target.value)}
              placeholder="请输入 toast 提示内容"
            />
          </label>
          <button type="button" onClick={handleToastClick}>
            触发 Toast
          </button>
        </section>
        <section className="sdk-action">
          <label>
            Modal 内容
            <input
              type="text"
              value={modalMessage}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setModalMessage(event.target.value)}
              placeholder="请输入 modal 内容"
            />
          </label>
          <button type="button" onClick={handleModalClick}>
            触发 Modal
          </button>
        </section>
      </div>
      <div className="commands">
        {commandValues.map((text: string, index: number) => (
          <section className="command" key={index}>
            <textarea
              value={text}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
                const { value } = event.target;
                setCommandValues((prev: string[]) => {
                  const next = [...prev];
                  next[index] = value;
                  return next;
                });
              }}
            />
            <button type="button" onClick={() => runCommand(index)}>
              执行
            </button>
          </section>
        ))}
      </div>
      <style>{`
        .page {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        #test {
          color: red;
        }

        .commands {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        section.command {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        textarea {
          width: 520px;
          min-height: 70px;
        }

        button {
          min-width: 90px;
          height: 32px;
          margin-left: 10px;
          padding: 0 12px;
        }

        .sdk-actions {
          border-top: 1px solid #ececec;
          padding-top: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        section.sdk-action {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        section.sdk-action label {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 12px;
          color: #333;
        }

        section.sdk-action input {
          width: 380px;
          height: 32px;
          padding: 0 8px;
          border: 1px solid #d0d0d0;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default Page1;
