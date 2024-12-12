import React, { createContext, useContext, useState } from 'react';

// Criação do contexto
const UserContext = createContext();

// Hook personalizado para acessar o contexto
export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext deve ser usado dentro de um UserProvider.');
    }
    return context;
};

// Provedor do contexto
export const UserProvider = ({ children }) => {
    const [ meuNome, setMeuNome] = useState('')
    const [ sorteado, setSorteado] = useState(false)
    const [ nomeSorteado, setNomeSorteado ] = useState('')
    const [ token, setToken ] = useState(null)

    return (
        <UserContext.Provider
        value={{
             meuNome,
             setMeuNome,
             sorteado,
             setSorteado,
             nomeSorteado,
             setNomeSorteado,
             token,
             setToken
             }}>
            {children}
        </UserContext.Provider>
    );
};