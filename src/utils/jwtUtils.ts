import Jwt from 'jsonwebtoken';

export const gerarToken = (usuario: string) => {
    return Jwt.sign({ usuario }, process.env.JWT_PASS ?? '', { expiresIn: '1h' });
};

export const verificarToken = (token: string) => {
    try {
        const decoded = Jwt.verify(token, process.env.JWT_PASS ?? '');
        return decoded;
    } catch (error) {
        throw new Error('Token inválido');
    }
};
