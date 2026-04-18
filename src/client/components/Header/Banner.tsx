
export type BannerOption = {
  id: string;
  title: string;
  color: string;
  background: string;

  visibility?: 'persistent' | 'removable';
  url?: string;
  icon?: string;
};

export const Banner = () => {
  return (
    <div class="navbar bg-primary text-primary-content px-4" >
      <div class="navbar-start text-xl bold">
        Annonce
      </div>
      <div class="navbar-end">
        <a class="link link-hover">En savoir plus</a>
      </div>
    </div>
  );
}