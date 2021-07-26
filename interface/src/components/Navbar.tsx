import React from 'react'
import { Button, Navbar as NB, Container} from 'react-bootstrap';

const Navbar = () => {
    return (
        <div>
            <NB>
                <Container>
                    <NB.Brand>Crypto Watch</NB.Brand>
                </Container>
            </NB>
        </div>

    )
}

export default Navbar
