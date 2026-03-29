import PlaygroundExperience from "../components/PlaygroundExperience";

function Playground({ content }) {
  const { heroConfiguratorProducts, configuratorDemo } = content;

  return (
    <main className="page-playground">
      <PlaygroundExperience
        libraryProducts={heroConfiguratorProducts}
        viewerText={configuratorDemo.shell.viewer}
      />
    </main>
  );
}

export default Playground;
