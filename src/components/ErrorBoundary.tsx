import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Sphere } from '@react-three/drei';

interface Props {
  children: ReactNode;
  fallbackColor: string | number;
  position: [number, number, number];
  size?: number;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Texture loading error caught:', error);
    console.warn('Component stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI - a simple colored sphere
      return (
        <Sphere position={this.props.position} args={[this.props.size || 5]}>
          <meshStandardMaterial color={this.props.fallbackColor} />
        </Sphere>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;