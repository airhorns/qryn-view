import styled from "@emotion/styled";

export const LogRowStyled = styled.div`
    color: ${({theme}) => theme.textColor};
    font-size: 12px;
    cursor: pointer;
    padding-left: 0.5rem;
    margin-left: 0.25rem;
    display: flex;
    flex-direction: column;
    margin-bottom: 2px;
    margin-top: 2px;
    font-family: monospace;
    &:hover {
        background: ${({theme}) => theme.logBgColor};
    }

    p {
        display: inline-block;
        overflow-wrap: anywhere;
    }
    border-left: 4px solid ${({rowColor}) => rowColor};
    .log-ts-row {
        display: flex;
    }
`;

export const RowLogContent = styled.span`
    font-size: 12px;
    color: ${({theme}) => theme.textPrimary};
    line-height: 1.5;
`;

export const RowTimestamp = styled.span`
    position: relative;
    color: ${({theme}) => theme.textColor};
    margin-right: 0.25rem;
    white-space: nowrap;
    font-size: 12px;
    line-height: 1.5;
`;

export const RowsCont = styled.div`
    overflow: hidden;
    overflow-y: auto;
    height: calc(100% - 20px);
`;