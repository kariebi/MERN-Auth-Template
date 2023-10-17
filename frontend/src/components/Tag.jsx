import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons'

const Tag = ({small}) => {
    return (
        <div className={`${small?'text-sm':'text-xl'}`}>
            Developed by Kariebi
            <Link to='https://github.com/kariebi'>
                <FontAwesomeIcon
                    icon={faGithub}
                    size="lg"
                    className='pl-1 hover:text-black/80'
                />
            </Link>
            <Link to='https://twitter.com/kariebi_'>
                <FontAwesomeIcon
                    icon={faTwitter}
                    size="lg"
                    className='pl-1 hover:text-black/80'
                />
            </Link>
        </div>
    )
}

export default Tag