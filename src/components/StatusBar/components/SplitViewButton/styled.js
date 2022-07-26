
import styled from '@emotion/styled'


export const BtnSmall = styled.button`
padding:3px 12px;
font-size: 12px;
line-height:20px;
cursor:pointer;
user-select: none;
border:none;
border-radius: 3px;
font-weight: 500;
white-space: nowrap;
display:flex;
align-items: center;
`

export const SplitButton = styled(BtnSmall)`
    background: ${props => props.theme.buttonDefault};
    border:1px solid ${(props)=>props.theme.buttonBorder};
    color: ${({ theme }) => theme.textColor};
    cursor: pointer;
    text-overflow: ellipsis;
    transition: 0.2s all;
    height:26px;
    margin: 0px 6px;
    span {
        margin-left: 4px;
        color: ${props => props.theme.textColor};
    }
    &:hover {
        background: ${props => props.theme.buttonHover};
    }
`