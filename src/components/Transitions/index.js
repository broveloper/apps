import clsx from 'clsx';
import { Children, cloneElement, forwardRef } from 'react';
import { Transition } from 'react-transition-group';


const getScale = value => `scale(${value}, ${value ** 2})`;
const getTransition = duration => `transform ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`;

const styles = {
	modal: {
		entering: {
			opacity: 0,
			transform: getScale(.95),
		},
		entered: {
			opacity: 1,
			transform: 'none',
		},
		exiting: {
			opacity: 1,
			transform: 'none',
		},
		exited: {
			opacity: 0,
			transform: getScale(.95),
		},
	},
	recover: {
		entering: {
			opacity: 0,
			transform: getScale(1.10),
		},
		entered: {
			opacity: 1,
			transform: 'none',
		},
		exiting: {
			opacity: 1,
			transform: 'none',
		},
		exited: {
			opacity: 0,
			transform: getScale(1.10),
		},
	},
};

export const TransitionComponent = forwardRef((props, ref) => {
	const {
		children,
		className,
		style,
		timeout = 150,
		transitionStyles,
		...rest
	} = props;
	return <Transition
		{...rest}
		timeout={timeout}>
		{state => {
			return <div
				className={className}
					style={{
					transition: getTransition(timeout),
					visibility: state === 'exited' && !props.in ? 'hidden' : undefined,
					...transitionStyles[state],
					...style,
				}}>{Children.map(children, child => child && cloneElement(child, { transitionState: state }))}</div>;
		}}
	</Transition>
});

export const Modal = forwardRef((props, ref) => {
	return <TransitionComponent
		{...props}
		className={clsx(props.className)}
		style={{
			display: 'flex',
			flexDirection: 'column',
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			...props.style,
		}}
		transitionStyles={styles.modal}/>;
});

export const Recover = forwardRef((props, ref) => <TransitionComponent
	{...props}
	style={{
		display: 'flex',
		flexDirection: 'column',
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		...props.style,
	}}
	transitionStyles={styles.recover}/>);