/*eslint-disable no-irregular-whitespace*/

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { withStyles } from 'material-ui/styles'
import ButtonBase from 'material-ui/ButtonBase'
import Typography from 'material-ui/Typography'
import Card, { CardContent } from 'material-ui/Card'

const styles = {
    card: {
        '&:hover': {
            boxShadow: '0px 1px 1px 0px #718792, 0px 2px 2px 0px #718792, 0px 3px 1px -2px #718792'
        },
        '&:hover h5': {
            textDecoration: 'underline'
        }

    },
	card_anchor: {
		minWidth: '100%',
        textDecoration: 'none'
	},
	card_button: {
		minWidth: '100%',
        padding: '1px 1px 2px 1px'
	}
}

const CustomCard = (props) => {
    const { classes } = props

    return (
        <ButtonBase className={classes.card_button} disableRipple={true}>
            <Link className={classes.card_anchor} to={props.to}>
                <Card className={classes.card}>
                    <CardContent className={classes.card_content}>
                        <Typography align='left' variant='subheading' component='h5'>{props.title}</Typography>
                        <Typography align='left' variant='caption'>{props.description}</Typography>
                    </CardContent>
                </Card>
            </Link>
        </ButtonBase>
    )
}

CustomCard.propTypes = {
    classes: PropTypes.object.isRequired,
    to: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
}

export default withStyles(styles)(CustomCard)