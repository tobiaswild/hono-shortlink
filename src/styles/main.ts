import { css } from 'hono/css';

export const styles = {
  reset: css`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
  `,
  body: css`
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #f5f5f5;
    color: #333;
  `,
  loginContainer: css`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #f5f5f5;
  `,
  loginForm: css`
    background: white;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  `,
  loginFormH2: css`
    text-align: center;
    margin-bottom: 30px;
    color: #2563eb;
  `,
  formGroup: css`
    margin-bottom: 15px;
  `,
  formGroupLabel: css`
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
  `,
  formGroupInput: css`
    width: 100%;
    padding: 10px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 16px;
  `,
  btn: css`
    border: none;
    margin: 0;
    padding: 0;
    width: auto;
    overflow: visible;

    background: transparent;

    color: inherit;
    font: inherit;

    line-height: normal;

    -webkit-font-smoothing: inherit;
    -moz-osx-font-smoothing: inherit;

    -webkit-appearance: none;

    padding: 4px 8px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    color: white;
  `,
  btnHover: css`
    opacity: 0.9;
  `,
  btnPrimary: css`
    background: #2563eb;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 500;
  `,
  btnPrimaryHover: css`
    background: #1d4ed8;
  `,
  btnFull: css`
    width: 100%;
  `,
  btnDanger: css`
    background: #dc2626;
  `,
  btnDangerHover: css`
    background: #b91c1c;
  `,
  copyBtn: css`
    background: #059669;
  `,
  copyBtnHover: css`
    background: #047857;
  `,
  deleteBtn: css`
    background: #dc2626;
  `,
  deleteBtnHover: css`
    background: #b91c1c;
  `,
  openBtn: css`
    background: #2563eb;
  `,
  openBtnHover: css`
    background: #1d4ed8;
  `,
  container: css`
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  `,
  header: css`
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  `,
  headerH1: css`
    color: #2563eb;
    margin-bottom: 10px;
  `,
  stats: css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  `,
  statCard: css`
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
  `,
  statNumber: css`
    font-size: 2rem;
    font-weight: bold;
    color: #2563eb;
  `,
  statLabel: css`
    color: #666;
    margin-top: 5px;
  `,
  section: css`
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  `,
  sectionH2: css`
    color: #2563eb;
    margin-bottom: 20px;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 10px;
  `,
  table: css`
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
  `,
  tableTh: css`
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
    font-weight: 600;
  `,
  tableTd: css`
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  `,
  tableTrHover: css`
    background: #f9fafb;
  `,
  shortlinkCode: css`
    font-family: monospace;
    background: #f3f4f6;
    padding: 4px 8px;
    border-radius: 4px;
    color: #dc2626;
  `,
  shortlinkUrl: css`
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  alert: css`
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 15px;
  `,
  alertSuccess: css`
    background: #d1fae5;
    color: #065f46;
    border: 1px solid #a7f3d0;
  `,
  alertError: css`
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  `,
  info: css`
    text-align: center;
    color: #666;
    margin-top: 20px;
    font-size: 14px;
  `,
  linkReset: css`
    text-decoration: none;
  `,
  buttons: css`
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
  `,
  formReset: css`
    margin-bottom: 0;
  `,
};
