import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import Translate, {translate} from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
//import TwitterFeed from '@site/src/components/TwitterFeed/TwitterFeed';

//const title={}

const FeatureList = [
  {
    title: translate({message: 'Welcome to my Mina Protocol Validator Web Site'}),
    Svg: require('@site/static/img/mina_logo.svg').default,
    description: (
      <>
        <Translate>This web site is about Mina Protocol</Translate><br/>
        <br/>
        <b><Link to="/docs/intro"> ENTER </Link></b>
        <br/><br/>
        🚧Under Construction🚧
        <br/>
        <br/>
        <b>NEW here ?</b>&nbsp;<Link to="/blog/welcome"> READ THIS </Link>
        <br/>
        <br/>
        <b><Translate>Looking for my payout simulator ?</Translate></b>&nbsp;<Link to="https://mina.naamahdaemon.eu/payout-simulator"> CLICK HERE </Link>        
      </>
    ),
  }
/*  {
    title: 'Easy to Use',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Docusaurus was designed from the ground up to be easily installed and
        used to get your website up and running quickly.
      </>
    ),
  },
  {
    title: 'Focus on What Matters',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Docusaurus lets you focus on your docs, and we&apos;ll do the chores. Go
        ahead and move your docs into the <code>docs</code> directory.
      </>
    ),
  },
  {
    title: 'Powered by React',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Extend or customize your website layout by reusing React. Docusaurus can
        be extended while reusing the same header and footer.
      </>
    ),
  },*/
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col text-center')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
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
        <div className="row justify-content-center">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
