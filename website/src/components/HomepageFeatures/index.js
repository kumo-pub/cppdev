import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Easy to Use',
    Svg: require('@site/static/img/1.png').default,
    description: (
      <>
        Kumo was designed from the ground up to be easily installed and
        used to get your searching up and running quickly.
      </>
    ),
  },
  {
    title: 'Focus on What Matters',
    Svg: require('@site/static/img/2.webp').default,
    description: (
      <>
        Kumo lets you focus on your business, and we&apos;ll do the chores. Go
        ahead and seek your business.
      </>
    ),
  },
  {
    title: 'Powered by Islands Architecture',
    Svg: require('@site/static/img/3.webp').default,
    description: (
      <>
        Extend or customize your application layout by reusing components. Kumo can
        be extended while reusing the components in Islands architecture.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img src={Svg} className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
