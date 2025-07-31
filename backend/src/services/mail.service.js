import nodemailer from "nodemailer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "petrlensin011@gmail.com", // Надо поменять
        pass: process.env.MAIL_SECRET_PASSWORD,
    },
});

await transporter.verify();
console.log("SMTP connection established");

export async function sendEmail(email, username, id) {
    const verify_token = jwt.sign({ username: username, id: id }, process.env.MAIL_SECRET, { expiresIn: "0.5h" });
    try {
        const info = await transporter.sendMail({
            from: "petrlensin011@gmail.com", // Надо изменить почту отправителя
            to: email,
            subject: "Подтверждение регистрации",
            text: "Вы зарегистрировались, вам осталось подтвердить вашу регистрацию!",
            html: `
<table width="100%" bgcolor="#f6f6f6" style="padding: 20px; font-family: Roboto, Arial, sans-serif">
    <tr>
        <td align="center">
            <table width="600" bgcolor="#ffffff" style="border-radius: 8px; padding: 30px; font-family: Roboto, Arial, sans-serif">
                <tr>
                    <td align="center" style="padding-bottom: 20px">
                        <img
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE8GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgOS4xLWMwMDIgNzkuYTZhNjM5NiwgMjAyNC8wMy8xMi0wNzo0ODoyMyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI1LjEyIChXaW5kb3dzKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjUtMDctMzBUMTY6NTA6NDUrMDM6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDI1LTA3LTMwVDE3OjA1OjE2KzAzOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDI1LTA3LTMwVDE3OjA1OjE2KzAzOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4ODBkYmE0Ni1lMzY5LWE0NDMtYTU4ZS0xNzY0MzAzYjQwYzYiIHhtcE1NOkRvY3VtZW50SUQ9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"
                            width="30px"
                            height="30px"
                            style="color: #4285f4"
                        />
                        <p style="color: #4285f4; font-size: 18px; margin: 8px 0 0; font-family: Roboto, Arial, sans-serif">Физичтариум</p>
                    </td>
                </tr>
                <tr>
                    <td align="center" style="font-family: Roboto, Arial, sans-serif">
                        <h2 style="color: #333; font-weight: normal; font-family: Roboto, Arial, sans-serif">Здравствуйте, ${username}!</h2>
                        <p style="color: #333; font-size: 16px; font-family: Roboto, Arial, sans-serif">
                            Вы зарегистрировались! Чтобы подтвердить регистрацию, нажмите на кнопку ниже:
                        </p>
                        <a
                            href="http://localhost:5000/auth/confirm.register/${verify_token}"
                            style="
                                display: inline-block;
                                background: #4285f4;
                                color: #fff;
                                padding: 12px 24px;
                                text-decoration: none;
                                border-radius: 6px;
                                margin-top: 20px;
                                font-family: Roboto, Arial, sans-serif;
                            "
                        >
                            Подтвердить регистрацию
                        </a>
                        <p style="font-size: 14px; color: #777; margin-top: 20px; font-family: Roboto, Arial, sans-serif">
                            Ссылка действительна 30 минут.
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

                `,
        });
        console.log("Email sent:", info.response);
    } catch (error) {
        console.error(error);
    }
}
